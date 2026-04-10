import OpenAI from "openai";
import { getPoemPrompt } from "./promptService.js";
import { fillTemplate } from "../utils/template.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

export async function separatePoem(poem) {
    //prompt: a yaml object
    const prompt = getPoemPrompt();
    const finalPrompt = fillTemplate(prompt.template, { poem });
    const response = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: [
            { role: "system", content: prompt.system },
            { role: "user", content: finalPrompt }
        ]
    });
  return response.choices[0].message.content;
}