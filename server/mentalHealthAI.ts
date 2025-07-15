import { OpenAI } from 'openai';

interface ClientContext {
  name?: string;
  email?: string;
  inquiryType?: string;
  previousMessages?: string[];
  sessionId?: string;
  urgencyLevel?: number;
  preferredLocation?: string;
}

interface LocationAnalysisRequest {
  clientLocation?: string;
  transportPreference?: string;
  accessibilityNeeds?: string[];
  urgencyLevel?: number;
}

interface LocationRecommendation {
  bestMatch: {
    locationId: string;
    name: string;
    score: number;
    reasons: string[];
  };
  reasoning: string[];
  alternatives: Array<{
    locationId: string;
    name: string;
    score: number;
  }>;
  message: string;
}

interface LocationRoutingRequest {
  message: string;
  preferredLocation?: string;
  urgencyLevel?: number;
}

interface LocationRoutingResult {
  locationId: string;
  reasoning: string[];
}

interface AIResponse {
  message: string;
  urgencyLevel: number;
  shouldEscalate: boolean;
  suggestedActions: string[];
  resources: string[];
}

export class MentalHealthAI {
  private openai: OpenAI | null = null;
  
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  private getSystemPrompt(): string {
    return `You are Compass, an AI assistant for Celia Dunsmore Counselling, a professional mental health practice in Melbourne. 

    CORE IDENTITY & ROLE:
    - You are a warm, professional practice navigator - NOT a therapist or counselor
    - Your role is administrative support, information provision, and crisis resource connection
    - You help clients navigate services, book appointments, and find appropriate resources
    - You maintain strict ethical boundaries around providing therapeutic advice

    PRACTICE INFORMATION:
    - Celia Dunsmore is an Accredited Mental Health Social Worker
    - Three locations: Brunswick (503 Sydney Road), Coburg Bell Street (81B Bell Street), Coburg Solana (420 Sydney Road)
    - Services: Individual counseling, couples counseling, family therapy, trauma therapy
    - Specializes in anxiety, depression, trauma, relationship issues, family dynamics
    - Medicare rebates available for individual sessions with GP referral

    COMMUNICATION STYLE:
    - Australian English, warm and professional
    - Culturally sensitive and inclusive
    - Non-judgmental and empathetic
    - Clear about your limitations as administrative support

    ETHICAL BOUNDARIES:
    - Never provide therapeutic advice or clinical assessments
    - Always identify yourself as administrative support, not a therapist
    - Refer all clinical matters to Celia or appropriate professionals
    - For crisis situations, provide immediate professional resources

    CRISIS PROTOCOL:
    - If someone mentions self-harm, suicide, or immediate danger:
      * Provide immediate crisis resources (Lifeline 13 11 14, Beyond Blue 1300 22 4636)
      * Encourage contacting emergency services (000) if in immediate danger
      * Suggest calling Celia directly for urgent mental health concerns
      * Flag for immediate escalation

    Your responses should be helpful, professional, and always within appropriate boundaries.`;
  }

  async processClientInquiry(message: string, context: ClientContext = {}): Promise<AIResponse> {
    if (!this.openai) {
      return {
        message: "For assistance with your inquiry, please contact Celia directly at (03) 9041 5031 or email info@celiadunsmorecounselling.com.au",
        urgencyLevel: 5,
        shouldEscalate: true,
        suggestedActions: ['Contact practice directly'],
        resources: ['Direct phone: (03) 9041 5031']
      };
    }

    try {
      const systemPrompt = this.getSystemPrompt();
      
      let userPrompt = message;
      if (context.name) {
        userPrompt = `Client: ${context.name}\nInquiry: ${message}`;
      }
      
      if (context.previousMessages && context.previousMessages.length > 0) {
        userPrompt += `\n\nPrevious conversation context:\n${context.previousMessages.join('\n')}`;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiMessage = completion.choices[0]?.message?.content || '';
      const analysis = await this.analyzeResponse(message, aiMessage);
      
      return {
        message: aiMessage,
        urgencyLevel: analysis.urgencyLevel,
        shouldEscalate: analysis.shouldEscalate,
        suggestedActions: analysis.suggestedActions,
        resources: analysis.resources
      };
      
    } catch (error) {
      console.error('AI processing error:', error);
      return {
        message: "I'm experiencing a technical issue. For immediate assistance, please call Celia directly at (03) 9041 5031 or email info@celiadunsmorecounselling.com.au",
        urgencyLevel: 5,
        shouldEscalate: true,
        suggestedActions: ['Contact practice directly'],
        resources: ['Direct phone: (03) 9041 5031']
      };
    }
  }

  private async analyzeResponse(originalMessage: string, aiResponse: string): Promise<{
    urgencyLevel: number;
    shouldEscalate: boolean;
    suggestedActions: string[];
    resources: string[];
  }> {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'want to die', 'self-harm', 
      'hurt myself', 'emergency', 'crisis', 'urgent', 'immediate help'
    ];
    
    const highUrgencyKeywords = [
      'anxiety', 'panic', 'depression', 'trauma', 'abuse', 'urgent',
      'help me', 'desperate', 'can\'t cope', 'overwhelmed'
    ];

    let urgencyLevel = 1;
    let shouldEscalate = false;
    let suggestedActions: string[] = [];
    let resources: string[] = [];

    const lowerMessage = originalMessage.toLowerCase();

    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      urgencyLevel = 10;
      shouldEscalate = true;
      suggestedActions = [
        'Provide immediate crisis resources',
        'Escalate to emergency services if immediate danger',
        'Connect with Celia urgently'
      ];
      resources = [
        'Emergency: 000',
        'Lifeline: 13 11 14',
        'Beyond Blue: 1300 22 4636',
        'Celia direct: (03) 9041 5031'
      ];
    } else if (highUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      urgencyLevel = 7;
      shouldEscalate = true;
      suggestedActions = [
        'Prioritize appointment booking',
        'Provide mental health resources',
        'Follow up within 24 hours'
      ];
      resources = [
        'Book urgent appointment',
        'Beyond Blue: 1300 22 4636',
        'Headspace: 1800 650 890'
      ];
    } else {
      urgencyLevel = 3;
      suggestedActions = [
        'Provide practice information',
        'Assist with appointment booking',
        'Share relevant resources'
      ];
      resources = [
        'Practice locations and hours',
        'Medicare rebate information',
        'Service descriptions'
      ];
    }

    return { urgencyLevel, shouldEscalate, suggestedActions, resources };
  }

  // Factory.ai Enhanced Location Intelligence
  async analyzeLocationMatch(request: LocationAnalysisRequest): Promise<LocationRecommendation> {
    const locations = [
      {
        id: 'brunswick',
        name: 'Brunswick Primary Location',
        features: ['public_transport', 'ground_floor', 'tram_stop', 'street_parking'],
        accessibility: ['ground_floor', 'wide_doorways'],
        transport: 'excellent'
      },
      {
        id: 'coburg-bell',
        name: 'Coburg Bell Street',
        features: ['on_site_parking', 'weekend_hours', 'train_station'],
        accessibility: ['ground_parking', 'accessible_entrance'],
        transport: 'good'
      },
      {
        id: 'coburg-solana',
        name: 'Coburg Solana Psychology',
        features: ['professional_centre', 'lift_access', 'specialist_referrals'],
        accessibility: ['lift_access', 'professional_centre'],
        transport: 'good'
      }
    ];

    let bestMatch = locations[0];
    let score = 50;
    let reasons: string[] = [];

    // Analyze transport preferences
    if (request.transportPreference === 'public') {
      if (bestMatch.id === 'brunswick') {
        score += 30;
        reasons.push('Excellent public transport with tram stop directly outside');
      }
    } else if (request.transportPreference === 'car') {
      bestMatch = locations[1]; // Coburg Bell Street
      score = 85;
      reasons = ['Free on-site parking available', '8-minute walk from Coburg Station'];
    }

    // Analyze accessibility needs
    if (request.accessibilityNeeds && request.accessibilityNeeds.length > 0) {
      if (request.accessibilityNeeds.includes('ground_floor')) {
        if (bestMatch.id === 'brunswick') {
          score += 20;
          reasons.push('Ground floor access with no stairs');
        }
      }
    }

    // Urgency considerations
    if (request.urgencyLevel && request.urgencyLevel >= 7) {
      reasons.push('Primary location recommended for urgent appointments');
      score += 15;
    }

    return {
      bestMatch: {
        locationId: bestMatch.id,
        name: bestMatch.name,
        score: Math.min(score, 100),
        reasons
      },
      reasoning: reasons,
      alternatives: locations.filter(l => l.id !== bestMatch.id).map(l => ({
        locationId: l.id,
        name: l.name,
        score: 60
      })),
      message: `Based on your preferences, ${bestMatch.name} would be ideal for you. ${reasons.join('. ')}.`
    };
  }

  async recommendOptimalLocation(request: LocationRoutingRequest): Promise<LocationRoutingResult> {
    const locations = ['brunswick', 'coburg-bell', 'coburg-solana'];
    
    // Default to primary location
    let recommendedLocation = 'brunswick';
    let reasoning = ['Primary location with comprehensive services'];

    // If client specified a preference
    if (request.preferredLocation) {
      if (locations.includes(request.preferredLocation)) {
        recommendedLocation = request.preferredLocation;
        reasoning = ['Client specified preference honored'];
      }
    }

    // Urgency-based routing
    if (request.urgencyLevel && request.urgencyLevel >= 7) {
      recommendedLocation = 'brunswick';
      reasoning = ['Primary location recommended for urgent cases', 'Immediate access to primary practitioner'];
    }

    // Analyze message content for location hints
    const message = request.message.toLowerCase();
    if (message.includes('parking') || message.includes('car')) {
      recommendedLocation = 'coburg-bell';
      reasoning = ['On-site parking available', 'Better suited for car access'];
    } else if (message.includes('weekend') || message.includes('saturday')) {
      recommendedLocation = 'coburg-bell';
      reasoning = ['Weekend appointments available', 'Saturday hours until 1 PM'];
    } else if (message.includes('tram') || message.includes('public transport')) {
      recommendedLocation = 'brunswick';
      reasoning = ['Excellent public transport access', 'Tram stop directly outside'];
    }

    return {
      locationId: recommendedLocation,
      reasoning
    };
  }
}

export function createMentalHealthAI(): MentalHealthAI {
  return new MentalHealthAI();
}