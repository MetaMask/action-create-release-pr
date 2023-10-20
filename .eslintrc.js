module.exports = {
  root: true,

  extends: ['@metamask/eslint-config', '@metamask/eslint-config-nodejs'],

  rules: {
    'n/no-process-env': 'off',
  },

  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
      rules: {
        '@typescript-eslint/consistent-type-definitions': [
          'error',
          'interface',
        ],
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-shadow': ['error', { builtinGlobals: true }],
        'no-shadow': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/unambiguous': 'off',
      },
    },
    {
      files: ['**/*.test.js', '**/*.test.ts'],
      extends: ['@metamask/eslint-config-jest'],
      rules: {
        '@typescript-eslint/restrict-template-expressions': 'off',
      },
    },
  ],

  ignorePatterns: ['!.eslintrc.js', 'lib/', 'dist/'],
};
