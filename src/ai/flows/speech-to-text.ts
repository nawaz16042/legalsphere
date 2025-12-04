
'use server';
/**
 * @fileOverview A flow for transcribing audio to text.
 *
 * - transcribeAudio - A function that transcribes audio data to text.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TranscribeAudioInputSchema = z.object({
  audio: z.string().describe("Audio data to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;


export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      prompt: [
        {
            text: `You are a highly skilled audio transcription service. Please transcribe the following audio and only return the transcribed text.`
        },
        {
          media: {
            url: input.audio,
          },
        },
      ],
    });

    return {text};
  }
);
