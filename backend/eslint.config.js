const js = require("@eslint/js"); 
const globals = require('globals');

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      ...js.configs.recommended.rules,

      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off"
    }
  }
];
