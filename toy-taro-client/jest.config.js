const path = require('path');

module.exports = {
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: [
        '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
        '([/\\\\]__tests__[/\\\\].*|\\.(test|spec))\\.(tsx?)$'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'], // 类似 webpack resolve.extensions
    moduleDirectories: ['node_modules'], // 类似 webpack resolve.modules
    rootDir: path.join(__dirname),
    // 覆盖率，可以直接 npm run test:c
    // collectCoverage: true,
    // collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
    coverageReporters: ['html', 'text-summary'],
}