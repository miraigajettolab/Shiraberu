//https://stackoverflow.com/questions/54627028/jest-unexpected-token-when-importing-css
module.exports = {
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
      '\\.(css|less)$': '<rootDir>/test/__mocks__/styleMock.js',
    },
    verbose: false,
    "setupTestFrameworkScriptFile": "<rootDir>/test/setupTests.js",
    testMatch: [
      "<rootDir>/test/**/*.test.js"
   ],
};