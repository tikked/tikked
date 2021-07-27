module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    '@typescript-eslint/tslint',
    'import',
    'no-null',
    'prefer-arrow-functions'
  ],
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit'
      }
    ],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true
      }
    ],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'arrow-body-style': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'camelcase': 'error',
    'comma-dangle': 'off',
    'complexity': 'off',
    'constructor-super': 'error',
    'curly': ['error', 'multi-line'],
    'dot-notation': 'error',
    'eol-last': 'error',
    'eqeqeq': ['error', 'always'],
    'guard-for-in': 'error',
    'id-blacklist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'null'
    ],
    'id-match': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['test/**/*.ts'] }],
    'import/no-internal-modules': 'off',
    'import/order': 'error',
    'linebreak-style': ['error', 'unix'],
    'max-classes-per-file': 'off',
    'max-len': [
      'error',
      {
        code: 100
      }
    ],
    'new-parens': 'error',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'no-bitwise': 'off',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-extra-bind': 'error',
    'no-fallthrough': 'error',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-null/no-null': 'error',
    'no-redeclare': 'error',
    'no-return-await': 'error',
    'no-sequences': 'error',
    'no-shadow': [
      'error',
      {
        hoist: 'all'
      }
    ],
    'no-sparse-arrays': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': 'off',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-functions/prefer-arrow-functions': [
      'error',
      {
        classPropertiesAllowed: false,
        disallowPrototype: false,
        returnStyle: 'unchanged',
        singleReturnOnly: false
      }
    ],
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'quote-props': ['error', 'consistent-as-needed'],
    'radix': 'error',
    'space-before-function-paren': 'off',
    'space-in-parens': ['error', 'never'],
    'spaced-comment': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',
    '@typescript-eslint/tslint/config': [
      'error',
      {
        rules: {
          'import-spacing': true,
          'jsdoc-format': true,
          'no-reference-import': true,
          'one-line': [true, 'check-open-brace', 'check-whitespace'],
          'prefer-conditional-expression': true,
          'whitespace': [
            true,
            'check-branch',
            'check-decl',
            'check-operator',
            'check-module',
            'check-separator',
            'check-type'
          ]
        }
      }
    ]
  }
};
