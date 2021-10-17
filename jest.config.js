module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts"],
  modulePathIgnorePatterns: ["build"],
  // setupFiles: ["<rootDir>/test/enVarSetup.ts"],
  // setupFilesAfterEnv: ["<rootDir>/test/customMatchers.ts"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node", "cjs"],
}
