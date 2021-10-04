module.exports = {
  mode: 'jit',
  purge: {
    content: [
      './src/components/**/*.{js,ts,jsx,tsx}',
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './example/**/*.{js,ts,jsx,tsx}',
    ],
  },
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 768px)' },
        desktop: { raw: '(min-width: 1024px)' },
        tablet: { raw: '(max-width: 1023px)' },
      },

      opacity: {},
      zIndex: {},
      colors: {},
    },
  },
  variants: {},
  plugins: [],
}
