module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json", // Important for some TypeScript rules
  },
  rules: {
    // You can add custom rules here
    // e.g., "@typescript-eslint/no-explicit-any": "warn"
  },
};
