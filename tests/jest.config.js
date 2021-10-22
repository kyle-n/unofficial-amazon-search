module.exports = {
  "rootDir": "../",
  "roots": [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],
  "testMatch": [
    "**/*.test.ts"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testEnvironment": 'jsdom',
  "setupFilesAfterEnv": ['./tests/setup.js'],
  "automock": false
}