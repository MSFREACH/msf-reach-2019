// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/src/$1',
  },
  modulePaths: [
    '<rootDir>/app/src',
    '<rootDir>/node_modules',
  ],
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!vue-google-autocomplete)'
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
