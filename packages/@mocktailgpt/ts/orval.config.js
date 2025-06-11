const { defineConfig } = require("orval");

module.exports = defineConfig({
  default: {
    input: { target: process.env.SWAGGER_PATH || "./swagger.yaml" },
    output: {
      client: "fetch",
      mode: "split",
      target: "./generated/",
      schemas: "./generated/models",
      mock: true,
      override: {
        mutator: { path: "./src/mutators/openaiMutator.ts" },
        mock: {
          properties: { path: "./src/mutators/mockMutator.ts" },
          delay: 250,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
