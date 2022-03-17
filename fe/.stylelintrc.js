module.exports = {
    extends: ['stylelint-config-recommended', 'stylelint-config-rational-order', 'stylelint-config-recommended-scss'],
    plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties', 'stylelint-scss'],
    rules: {
        'indentation': 4,
        'declaration-block-no-duplicate-properties': true, // 不能重复声明属性
        'block-no-empty': true, // 禁止空快 .a { // nothing }
        'function-comma-space-after': 'always', // 函数逗号后需要空格 transform: translate(10px, 20px);
        'function-comma-space-before': 'never', // 函数逗号前不要空格 transform: translate(10px, 20px);
        'declaration-bang-space-before': 'always', // important 前需要空格
        'declaration-bang-space-after': 'never', // important 后不要空格
        'declaration-block-semicolon-newline-after': 'always-multi-line', // 多行规则的分号后必须有换行
        'declaration-block-semicolon-newline-before': 'never-multi-line', // 多行规则的分号前不能有换行
        'declaration-block-semicolon-space-after': 'always-single-line', // 单行块的分号后必须有空格
        'declaration-block-semicolon-space-before': 'never', // 分号前无空格
        'declaration-block-trailing-semicolon': 'always', // 最后也需要分号 .a { color: red; }
        'block-closing-brace-empty-line-before': 'never', // 禁止大括号闭端之前空行
        'block-closing-brace-newline-after': ['always', {
            ignoreAtRules: ['if', 'else'],
        }], // 大括号闭端之后必须有换行符
        'block-closing-brace-newline-before': 'always-multi-line', // 多行规则的大括号闭端之前需要换行符
        'block-closing-brace-space-before': 'always-single-line', // 单行块大括号闭端之前要有空格
        'block-opening-brace-newline-after': 'always-multi-line', // 多行规则的大括号开端之后需要换行
        'block-opening-brace-space-before': 'always', // 大括号前需要空格 a {}
        'block-opening-brace-space-after': 'always-single-line', // 单行块大括号开端之后需要空格
        'selector-list-comma-space-after': 'always', // 选择器逗号空格 .a, .b {}
        'selector-list-comma-space-before': 'never', // 选择器逗号空格 .a, .b {}
        'rule-empty-line-before': ['always-multi-line', {
            except: ['first-nested']
        }], // ⭐多行规则之前要有空行
        'at-rule-empty-line-before': ['always', { except: 'blockless-after-same-name-blockless', ignore: 'after-comment' }], // 在规则之前要求空行
    },
    ignoreFiles: ['node_modules/**/*'],
}