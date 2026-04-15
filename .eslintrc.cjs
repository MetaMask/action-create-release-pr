module.exports = {
  root: true,

  extends: ['@metamask/eslint-config', '@metamask/eslint-config-nodejs'],

  rules: {
    'n/no-process-env': 'off',

    'import-x/extensions': ['error', 'ignorePackages'],
    'import-x/no-useless-path-segments': ['error', { noUselessIndex: false }],
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
        'import-x/unambiguous': 'off',
      },
    },
  ],

  ignorePatterns: ['!.eslintrc.cjs', 'lib/', 'dist/'],
};
