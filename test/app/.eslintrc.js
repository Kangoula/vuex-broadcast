module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue'],
  extends: ['eslint:recommended', 'prettier', 'plugin:vue/recommended'],
  rules: {
    'vue/no-unused-components':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'accessor-pairs': 'error',
    'array-bracket-newline': 'error',
    'array-bracket-spacing': 'error',
    'array-callback-return': 'off',
    'array-element-newline': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true
      }
    ],
    'block-scoped-var': 'error',
    'block-spacing': ['error', 'always'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    'callback-return': 'off',
    camelcase: 'off',
    'capitalized-comments': 'off',
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'comma-spacing': [
      'error',
      {
        after: true,
        before: false
      }
    ],
    'comma-style': ['error', 'last'],
    complexity: 'error',
    'computed-property-spacing': ['error', 'never'],
    'consistent-return': 'off',
    'consistent-this': 'error',
    curly: 'off',
    'default-case': 'error',
    'dot-location': 'off',
    'dot-notation': [
      'error',
      {
        allowKeywords: true
      }
    ],
    'eol-last': 'error',
    eqeqeq: 'error',
    'func-call-spacing': 'error',
    'func-name-matching': 'error',
    'func-names': 'off',
    'func-style': 'off',
    'function-paren-newline': 'off',
    'generator-star-spacing': 'error',
    'global-require': 'error',
    'guard-for-in': 'off',
    'handle-callback-err': 'error',
    'id-blacklist': 'error',
    'id-length': 'off',
    'id-match': 'error',
    'implicit-arrow-linebreak': 'off',
    indent: 'off',
    'indent-legacy': 'off',
    'init-declarations': 'error',
    'jsx-quotes': 'error',
    'key-spacing': 'error',
    'keyword-spacing': [
      'warn',
      {
        overrides: {
          if: {
            after: true
          },
          for: {
            after: true
          },
          while: {
            after: true
          },
          function: {
            after: true
          }
        }
      }
    ],
    'line-comment-position': 'off',
    'linebreak-style': 'off',
    'lines-around-comment': 'off',
    'lines-around-directive': 'error',
    'lines-between-class-members': 'error',
    'max-classes-per-file': 'error',
    'max-depth': ['error', { max: 7 }],
    'max-len': 'off',
    'max-lines': [
      'error',
      { skipComments: true, skipBlankLines: true, max: 500 }
    ],
    'max-lines-per-function': 'off',
    'max-nested-callbacks': 'error',
    'max-params': 'off',
    'max-statements': ['error', 60],
    'max-statements-per-line': 'off',
    'multiline-comment-style': 'off',
    'new-parens': 'error',
    'newline-after-var': 'off',
    'newline-before-return': 'off',
    'newline-per-chained-call': 'off',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-await-in-loop': 'error',
    'no-bitwise': 'off',
    'no-buffer-constructor': 'error',
    'no-caller': 'error',
    'no-catch-shadow': 'error',
    'no-confusing-arrow': 'off',
    'no-continue': 'error',
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['error', 'warn'] }]
        : ['warn', { allow: ['error', 'warn'] }],
    'no-div-regex': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': 'off',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'off',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-inline-comments': 'off',
    'no-invalid-this': 'off',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-magic-numbers': 'off',
    'no-mixed-operators': 'off',
    'no-mixed-requires': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-native-reassign': 'error',
    'no-negated-condition': 'off',
    'no-negated-in-lhs': 'error',
    'no-nested-ternary': 'off',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'off',
    'no-path-concat': 'off',
    'no-plusplus': 'off',
    'no-process-env': 'off',
    'no-process-exit': 'error',
    'no-proto': 'error',
    'no-prototype-builtins': 'off',
    'no-restricted-globals': 'error',
    'no-restricted-imports': 'error',
    'no-restricted-modules': 'error',
    'no-restricted-properties': 'error',
    'no-restricted-syntax': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'off',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'no-spaced-func': 'error',
    'no-sync': 'off',
    'no-tabs': 'off',
    'no-template-curly-in-string': 'off',
    'no-ternary': 'off',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'off',
    'no-undef': 'off',
    'no-undef-init': 'off',
    'no-undefined': 'off',
    'no-underscore-dangle': 'off',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-vars': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
        args: 'none'
      }
    ],
    'no-unused-expressions': 'off',
    'no-use-before-define': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-warning-comments':
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-whitespace-before-property': 'off',
    'no-with': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': 'off',
    'object-curly-spacing': 'off',
    'object-property-newline': 'off',
    'object-shorthand': 'off',
    'one-var': 'off',
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'error',
    'operator-linebreak': 'off',
    'padded-blocks': 'off',
    'padding-line-between-statements': 'error',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'error',
    'prefer-destructuring': 'off',
    'prefer-numeric-literals': 'error',
    'prefer-object-spread': 'off',
    'prefer-promise-reject-errors': 'off',
    'prefer-reflect': 'off',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'off',
    'quote-props': 'off',
    quotes: ['warn', 'single'],
    radix: 'error',
    'require-await': 'error',
    'require-jsdoc': 'off',
    'rest-spread-spacing': 'error',
    semi: ['error', 'never'],
    'semi-spacing': 'error',
    'semi-style': ['error', 'last'],
    'sort-imports': 'off',
    'sort-keys': 'off',
    'sort-vars': 'off',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'off',
    strict: 'error',
    'switch-colon-spacing': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'unicode-bom': ['error', 'never'],
    'valid-jsdoc': 'warn',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'wrap-regex': 'error',
    'yield-star-spacing': 'error',
    yoda: ['error', 'never']
  }
}
