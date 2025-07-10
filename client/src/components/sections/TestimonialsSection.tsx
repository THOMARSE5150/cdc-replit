import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      text: "Celia's compassionate approach helped me work through anxiety that had been affecting my daily life for years. Her specialized anxiety therapy techniques made a real difference.",
      author: "Sarah M.",
      location: "Brunswick",
      service: "Anxiety Therapy",
      rating: 5
    },
    {
      id: 2,
      text: "The EMDR therapy sessions with Celia were transformative. She created a safe space for me to process trauma and I feel much more at peace now.",
      author: "Michael T.",
      location: "Coburg", 
      service: "EMDR Therapy",
      rating: 5
    },
    {
      id: 3,
      text: "Celia helped my partner and I improve our communication significantly. Her couples therapy approach is both professional and warm.",
      author: "Emma & David",
      location: "Melbourne North",
      service: "Couples Therapy",
      rating: 5
    },
    {
      id: 4,
      text: "As someone who was hesitant about therapy, Celia's non-judgmental approach made me feel comfortable from the first session. Highly recommend her services.",
      author: "James L.",
      location: "Brunswick",
      service: "Individual Counselling",
      rating: 5
    },
    {
      id: 5,
      text: "The convenient Brunswick location and Celia's professional approach made therapy accessible for me. Medicare rebates made it affordable too.",
      author: "Lisa K.",
      location: "Melbourne",
      service: "Mental Health Support",
      rating: 5
    },
    {
      id: 6,
      text: "Celia's expertise in trauma therapy and her caring nature helped me through a difficult period. I'm grateful for her support and guidance.",
      author: "Alex R.",
      location: "Coburg",
      service: "Trauma Counselling", 
      rating: 5
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
            >
              <Star className="mr-2 h-4 w-4 fill-current" />
              Client Testimonials
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
            >
              What Clients Say About Their Experience
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-text-secondary max-w-2xl mx-auto"
            >
              Real experiences from clients who found healing and growth through compassionate counselling
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
              >
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-text-secondary mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">
                        {testimonial.service}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-primary/5 rounded-xl p-6 max-w-2xl mx-auto"
            >
              <p className="text-text-secondary mb-2">
                <strong>Ready to start your journey?</strong>
              </p>
              <p className="text-sm text-text-secondary">
                Medicare rebates available with Mental Health Care Plan from your GP. 
                Convenient locations in Brunswick and Coburg with telehealth options.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}