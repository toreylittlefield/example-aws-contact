/**
 * Configure ESLint
 *
 * @see https://eslint.org/docs/user-guide/configuring
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:import/warnings'],
  plugins: ['prettier', 'jsx-a11y', 'import'],
  globals: {
    document: true,
    window: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 0,
    'no-alert': 0,
    'no-nested-ternary': 0,
    'import/prefer-default-export': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    radix: [2, 'as-needed'],
    'class-methods-use-this': 0,
    'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
    'react/no-unused-prop-types': 0,
    'consistent-return': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'react/static-property-placement': 0,
    'react/jsx-props-no-spreading': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
