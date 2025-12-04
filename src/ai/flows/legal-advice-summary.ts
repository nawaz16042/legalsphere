
'use server';

/**
 * @fileOverview Provides a summary of the legal advice given by the chatbot.
 *
 * - legalAdviceSummary - A function that summarizes the chatbot's response.
 * - LegalAdviceSummaryInput - The input type for the legalAdviceSummary function.
 * - LegalAdviceSummaryOutput - The return type for the legalAdviceSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const LegalAdviceSummaryInputSchema = z.object({
  advice: z.string().describe('The legal advice provided by the chatbot.'),
  language: z.string().optional().describe('The language for the summary (e.g., "en", "hi"). Defaults to English.'),
});
export type LegalAdviceSummaryInput = z.infer<typeof LegalAdviceSummaryInputSchema>;

const LegalAdviceSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the legal advice.'),
});
export type LegalAdviceSummaryOutput = z.infer<typeof LegalAdviceSummaryOutputSchema>;

export async function legalAdviceSummary(input: LegalAdviceSummaryInput): Promise<LegalAdviceSummaryOutput> {
  return legalAdviceSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'legalAdviceSummaryPrompt',
  input: {schema: LegalAdviceSummaryInputSchema},
  output: {schema: LegalAdviceSummaryOutputSchema},
  prompt: `Summarize the following legal advice in a concise manner in the specified language ({{language}}), in about 3-4 words:

{{{advice}}}`,
});

const legalAdviceSummaryFlow = ai.defineFlow(
  {
    name: 'legalAdviceSummaryFlow',
    inputSchema: LegalAdviceSummaryInputSchema,
    outputSchema: LegalAdviceSummaryOutputSchema,
  },
  async input => {
    // If advice is empty, return a default summary.
    if (!input.advice || input.advice.trim() === '') {
      return { summary: 'New Chat' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
