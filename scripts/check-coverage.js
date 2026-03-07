#!/usr/bin/env node
const fs = require('fs');
const threshold = parseInt(process.argv[2] || '0', 10);

const coverageFile = 'coverage.json';
if (!fs.existsSync(coverageFile)) {
  console.log('No coverage file found - skipping coverage check');
  process.exit(0);
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const total = coverage.total || {};
const lines = total.lines?.pct || 0;

console.log(`Coverage: ${lines}% (threshold: ${threshold}%)`);
process.exit(lines >= threshold ? 0 : 1);
