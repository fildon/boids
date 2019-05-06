module.exports = function(config) {
  config.set({
    testRunner: "mocha",
    mutator: "typescript",
    transpilers: ["typescript"],
    reporter: ["clear-text", "progress"],
    testFramework: "mocha",
    coverageAnalysis: "off",
    tsconfigFile: "tsconfig.json",
    mutate: [
      "src/**/*.ts",
      "!src/app.ts",
      "!src/simulationManager.ts",
      '!src/inputHandler.ts',
      "!src/canvas.ts"
    ],
    mochaOptions: {
      files: [
        "dist/**/*.spec.js",
      ]
    }
  });
};
