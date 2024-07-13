import fs from "fs";
import { defaultColors } from "../provider/color-palette";

export function generateDefaultCssVariables(): string {
  const scriptSelfName = "a script"; // __filename.split(__dirname+"/").pop()
  let result = "/*\n";
  result += `  This file is automatically generated by ${scriptSelfName}.\n`;
  result += "  DO NOT change it manually.\n";
  result += "*/\n";
  result += "\n";
  result += ":root {\n";
  for (const [key, value] of Object.entries(defaultColors)) {
    result += `  --color-${key}: ${value.value.hexStringNoAlpha};\n`;
    result += `  --color-${key}-complement: ${value.complementValue.hexStringNoAlpha};\n`;
  }
  result += `  --default-bg-color: #808080;\n`;
  result += "}\n";
  return result;
}

export const fileName = "src/css/default-css-variables.css";

export function writeDefaultCssVariables() {
  const content = generateDefaultCssVariables();
  fs.writeFileSync(fileName, content);
}

writeDefaultCssVariables();
