'use strict';

const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  extends: 'eslint:recommended',
  
  env: {
    browser: true,
    es6: true
  },

  parser: 'babel-eslint',
  plugins: ['babel'],

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true
    }
  }
}
