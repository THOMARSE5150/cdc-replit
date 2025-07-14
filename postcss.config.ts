import type { ProcessOptions } from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const config: ProcessOptions = {
  plugins: [tailwindcss, autoprefixer]
};

export default config;