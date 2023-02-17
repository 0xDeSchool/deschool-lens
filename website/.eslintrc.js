module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:import/typescript', 'plugin:react/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['~', './src/']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    polyfills: ['Promise', 'URL'],
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/consistent-type-imports': 2,
        '@typescript-eslint/class-methods-use-this': 'off',
      },
    },
  ],
  // https://github.com/typescript-eslint/typescript-eslint/issues/46#issuecomment-470486034
  rules: {
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/jsx-wrap-multilines': ['error', { declaration: false, assignment: false }],
    'react/jsx-filename-extension': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'react/destructuring-assignment': 0,
    'react/require-default-props': 0,
    'react/sort-comp': 0,
    'react/display-name': 0,
    'react/static-property-placement': 0,
    'react/jsx-no-bind': 0, // Should not check test file
    'react/no-find-dom-node': 0,
    'react/no-unused-prop-types': 0,
    'react/default-props-match-prop-types': 0,
    'react-hooks/rules-of-hooks': 2, // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 0, // Checks effect dependencies
    'react/function-component-definition': 0,
    'react/no-unused-class-component-methods': 0,
    'react/no-unstable-nested-components': [0, { allowAsProps: true }],
    'import/extensions': 0,
    'import/no-cycle': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': [2, { ignore: ['@unocss/reset/tailwind.css', 'uno.css'] }],

    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/media-has-caption': [
      0,
      {
        audio: ['Audio'],
        video: ['Video'],
        track: ['Track'],
      },
    ],

    'comma-dangle': ['error', 'always-multiline'],
    'consistent-return': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-continue': 0,
    'no-restricted-globals': 0,
    'max-classes-per-file': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 2,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': [2, { ignoreTypeValueShadow: true }],
    'no-undef': 0,

    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/'],
}
