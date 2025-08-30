import { defineConfig } from 'eslint/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))
const compat = new FlatCompat({
  baseDirectory: __dirname,
  gitignorePath,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  compat.extends('next/core-web-vitals'),
  eslintConfigPrettier,
])

