import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'no-undef': 'error',
      'no-extra-semi': 'error',
      eqeqeq: ['error', 'always'],
      'consistent-return': 'warn',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'prefer-const': 'warn',
      'no-var': 'error',
      'arrow-parens': ['error', 'as-needed'],
    },
  },
];
