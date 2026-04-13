import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
  ignores: [
    "node_modules",
    "dist",
    "tailwind.config.js"
  ]
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },

  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
    },

    rules: {
      // React Hooks规则
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 未使用变量
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", argsIgnorePattern: "^_" }
      ]
    },

    settings: {
      react: {
        version: "detect"
      }
    }
  }
];