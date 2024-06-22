import { test, expect } from "vitest";
import fs from "fs";
import {
  fileName,
  generateDefaultCssVariables,
  writeDefaultCssVariables,
} from "./default-css-variables";

function readCssFileAsString() {
  return fs.readFileSync(fileName, "utf8");
}

test("Default CSS variables generator", async () => {
  const originalContent = readCssFileAsString();
  const generatedContent = generateDefaultCssVariables();
  expect(generatedContent).to.be.equal(originalContent);
  writeDefaultCssVariables();
  const writtenContent = readCssFileAsString();
  expect(generatedContent).to.be.equal(writtenContent);
});
