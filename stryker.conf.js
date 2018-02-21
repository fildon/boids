module.exports = function(config) {
  config.set({
    files: [
      "!src/app.ts"
    ],
    testRunner: "mocha",
    mutator: "typescript",
    transpilers: ["typescript"],
    reporter: ["clear-text", "progress"],
    testFramework: "mocha",
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    mutate: [
      "src/**/*.ts",
      "!src/app.ts"
    ]
  });
};
