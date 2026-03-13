const { createDefaultPreset } = require("ts-jest");
// import {createDefaultPreset} from 'ts-jest'

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: [
    "**/__tests__/e2e/**/*.spec.ts",
    "**/__tests__/unit/**/*.unit.ts",
  ],
};
