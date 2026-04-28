// const { createDefaultPreset } = require("ts-jest");
// import {createDefaultPreset} from 'ts-jest'

// const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/__tests__/e2e/'],
  testMatch: [
    "**/*.e2e.spec.ts"
  ],
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(inversify|@inversifyjs)/)"
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", {
      useESM: true,
    }]
  },
  // transform: {
  //   ...tsJestTransformCfg,
  // },
};
