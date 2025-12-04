
'use server';

/**
 * @fileOverview A legal assistance chatbot flow that answers user queries related to Indian law.
 *
 * - legalQueryChatbot - A function that handles the legal query process.
 * - LegalQueryChatbotInput - The input type for the legalQueryChatbot function.
 * - LegalQueryChatbotOutput - The return type for the legalQueryChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { findRelevantArticles } from '@/services/constitution-retriever';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const LegalQueryChatbotInputSchema = z.object({
  query: z.string().describe('The user query related to Indian law.'),
  history: z.array(MessageSchema).optional().describe('The conversation history.'),
  language: z.string().optional().describe('The language for the response (e.g., "en", "hi"). Defaults to English.'),
  attachment: z.string().optional().describe("An optional image or document (like a PDF) provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type LegalQueryChatbotInput = z.infer<typeof LegalQueryChatbotInputSchema>;

const SourceSchema = z.object({
  title: z.string().describe('The title of the source.'),
  url: z.string().describe('The URL of the source.'),
});

const LegalQueryChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query, formatted in Markdown.'),
  sentiment: z.string().optional().describe("The user's sentiment (e.g., neutral, curious, anxious, frustrated)."),
  sources: z.array(SourceSchema).optional().describe('A list of sources and citations for the answer.'),
});
export type LegalQueryChatbotOutput = z.infer<typeof LegalQueryChatbotOutputSchema>;

export async function legalQueryChatbot(input: LegalQueryChatbotInput): Promise<LegalQueryChatbotOutput> {
 try {
    const fullConversationQuery = (input.history ?? [])
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n') + `\n${input.query}`;

    const relevantArticles = findRelevantArticles(fullConversationQuery);
    return await legalQueryChatbotFlow({...input, relevantArticles});
  } catch (error) {
    console.error(`Fatal error in legalQueryChatbot: ${error}`);
    return {
      answer: "I apologize, but I've encountered a critical error and cannot process your request. The issue has been logged. Please try again later.",
    };
  }
}

const LegalQueryChatbotPromptInputSchema = LegalQueryChatbotInputSchema.extend({
    relevantArticles: z.array(z.object({
        title: z.string(),
        text: z.string(),
        url: z.string(),
    })).optional().describe('Relevant articles from the Indian Constitution.'),
});


const prompt = ai.definePrompt({
  name: 'legalQueryChatbotPrompt',
  input: {schema: LegalQueryChatbotPromptInputSchema},
  output: {schema: LegalQueryChatbotOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `
**CRITICAL INSTRUCTION: Your entire response MUST be in the language specified: {{#if language}}{{language}}{{else}}en{{/if}}**

You are a helpful and empathetic legal expert specializing in all aspects of Indian law, including constitutional law, statutory acts (like the Motor Vehicles Act, Consumer Protection Act, etc.), and general legal procedures.

Your primary goal is to provide clear, accurate, and accessible legal information in the requested language, **formatted as a JSON object** that strictly follows the schema provided in the instructions.

**Instructions:**

1.  **Analyze Sentiment:** First, analyze the user's sentiment from their query (e.g., neutral, curious, anxious, frustrated).

2.  **Engaging Opening:** Start your response with a unique and engaging opening. Avoid generic phrases.

3.  **Answer Generation:**
    *   **If 'Relevant Constitutional Articles' are provided below, use them as a primary reference point for your answer.** You should integrate their content thoughtfully.
    *   **Then, expand your answer using your general knowledge of other Indian laws and statutes** to provide a comprehensive and practical response.
    *   **If an attachment is provided, analyze its content carefully and use it as a primary basis for your answer.**
    *   **If no articles or attachment are provided, answer using your general knowledge of Indian law.**

4.  **Formatting:**
    *   Use Markdown for clarity: bold headings, bullet points for lists, and proper spacing.

5.  **Provide Sources:**
    *   If you used the provided articles, list them as sources.
    *   If you used general knowledge, cite reliable, real-world sources (e.g., official government websites for specific acts).
    *   **DO NOT invent or link to unverified URLs.** If you are unsure, include no sources.

6.  **Domain Boundary:** If the query is not about legal topics, politely decline by stating: "I can only assist with questions related to Indian law and legal procedures. Please ask a relevant question."

{{#if relevantArticles}}
**Relevant Constitutional Articles (Primary Reference):**
{{#each relevantArticles}}
**{{{title}}}**: {{{text}}}
URL: {{{url}}}
{{/each}}
{{/if}}

{{#if attachment}}
**Attachment Provided (Primary Context):**
{{media url=attachment}}
{{/if}}

**Conversation History:**
{{#if history}}
{{#each history}}
**{{role}}**: {{{content}}}
{{/each}}

{{/if}}
**user**: {{{query}}}
`,
});

const legalQueryChatbotFlow = ai.defineFlow(
  {
    name: 'legalQueryChatbotFlow',
    inputSchema: LegalQueryChatbotPromptInputSchema,
    outputSchema: LegalQueryChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI model returned an empty output.');
    }
    return output;
  }
);
