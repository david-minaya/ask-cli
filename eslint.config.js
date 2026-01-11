import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ['dist/**', 'eslint.config.js']
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, extends: ["js/recommended"], 
    languageOptions: { globals: globals.node } 
  },
  tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/indent': ['warn', 2],
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/eol-last': ['warn', 'always'],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used' }],
      '@stylistic/member-delimiter-style': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: { attributes: false} } ],
    }
  },
]);
