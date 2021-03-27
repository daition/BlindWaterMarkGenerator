module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories:[
    "node_modules",
    "src",
    "src/jslib"
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
};