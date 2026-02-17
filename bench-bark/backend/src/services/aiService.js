import OpenAI from 'openai';
import env from '../config/environment.js';

let openai;

function getClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: env.openai.apiKey || 'not-configured' });
  }
  return openai;
}

export async function analyzeBreedAndAge(imageUrl) {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a dog breed identification expert. Analyze the dog photo and return a JSON object with: breed (string), estimated_age (string like "2-3 years" or "6 months"), breed_confidence (number 0-100), age_confidence (number 0-100). If no dog is detected, return { "error": "No dog detected" }.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Identify the breed and estimate the age of this dog.' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 300,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  return JSON.parse(content);
}
