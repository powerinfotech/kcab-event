module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
        'es6': true,
        'amd': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'tsx': true
        },
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        '@typescript-eslint'
    ],
    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    'globals': {
        '$': true,
        'require': true,
        'process': true,
    },
    'root': true,
    'rules': {
        '@typescript-eslint/no-array-constructor': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-extra-semi': 0,
        'no-unreachable': 0,
        'no-mixed-spaces-and-tabs':0,
        'semi': [2, 'always'],
        'quotes': ['warn', 'single'],
        'no-console': ['off'],
        'linebreak-style': 0,
        'import/prefer-default-export': 0,
        'import/extensions': 0,
        'no-use-before-define': 0,
        'import/no-unresolved': 0,
        'react/react-in-jsx-scope': 0,
        '@typescript-eslint/no-var-requires': 0,
        // 'import/no-extraneous-dependencies': 0, // 테스트 또는 개발환경을 구성하는 파일에서는 devDependency 사용을 허용
        'no-shadow': 0,
        'react/prop-types': 0,
        'react/jsx-filename-extension': [
            2,
            {extensions: ['.js', '.jsx', '.ts', '.tsx']},
        ],
        // 'jsx-a11y/no-noninteractive-element-interactions': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        // '@typescript-eslint/no-unused-vars': 0
        '@typescript-eslint/no-empty-interface':0
    }
};
