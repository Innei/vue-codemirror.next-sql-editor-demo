module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-nested': { bubble: ['screen'], unwrap: ['layer'] },
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'nesting-rules': true,
        'color-mod-function': true,
        'system-ui-font-family': true,
        'hexadecimal-alpha-notation': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    },
  },
}
