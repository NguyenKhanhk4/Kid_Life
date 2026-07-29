module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier', // Turns off rules that conflict with prettier
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier'],
  env: {
    'react-native/react-native': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Formatting is enforced separately; the existing UI intentionally uses
    // compact JSX and platform-native line endings.
    'prettier/prettier': 'off',
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    'react-native/no-raw-text': 'off', // Can be too aggressive
    'react-native/sort-styles': 'off', // Enforcing style sorting is annoying
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/no-unused-styles': 'off',
    'react-native/no-single-element-style-arrays': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-children-prop': 'off',
    'react-hooks/set-state-in-effect': 'off',
    'react-hooks/immutability': 'off',
    'react-hooks/refs': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/', 'coverage/'],
};
