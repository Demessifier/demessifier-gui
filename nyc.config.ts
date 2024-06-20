export default {
  "extends": "@istanbuljs/nyc-config-typescript",
  "extension": [".js", ".ts", ".vue"],
  "reporter": ["lcov"],
  "all": true,
  "check-coverage": true,
  "report-dir": "test/nyc",
  "temp-directory": "test/.nyc_output"
}