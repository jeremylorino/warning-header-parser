"use strict";

module.exports = {
  assert: 'code',
  coverage: true,
  coverageExclude: ['test.js'],
  threshold: 80,
  lint: false,
  reporter: ['console', 'html', 'json'],
  output: ['stdout', './artifacts/coverage.html', './artifacts/data.json'],
  verbose: true,
};
