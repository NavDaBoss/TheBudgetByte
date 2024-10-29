import tsParser from '@typescript-eslint/parser';
import tsLint from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      tsLint,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off',
      semi: ['error', 'always'],
    },
  },
];
