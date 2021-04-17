module.exports = {
  root: true,

  extends: ['@metamask/eslint-config', '@metamask/eslint-config-nodejs'],

  rules: {
    'node/no-process-env': 'off',
    'node/no-sync': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-unpublished-require': 'off',
  },

  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['@metamask/eslint-config-typescript'],
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error', { builtinGlobals: true }],
      },
    },
    {
      files: ['**/*.test.js', '**/*.test.ts'],
      extends: ['@metamask/eslint-config-jest'],
    },
  ],

  ignorePatterns: ['!.eslintrc.js', 'lib', 'dist'],
};
