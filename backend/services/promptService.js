import fs from "fs";
import yaml from "yaml";


export function getPoemPrompt() {
  const file = fs.readFileSync("./prompts/poem_sep.yaml", "utf8");
  const prompt = yaml.parse(file);
  return prompt;
}