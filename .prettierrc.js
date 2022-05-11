module.exports = {
  semi: true,
  singleQuote: true,
  htmlWhitespaceSensitivity: 'ignore',
  tabWidth: 2,
  useTabs: true,
  bracketSpacing: true,
  trailingComma: 'none',
  printWidth: 80,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.html',
      options: {
        printWidth: 1000
      }
    }
  ]
};
