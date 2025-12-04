
"use server";

import { legalQueryChatbot, LegalQueryChatbotInput, LegalQueryChatbotOutput } from "@/ai/flows/legal-query-chatbot";
import { legalAdviceSummary, LegalAdviceSummaryInput } from "@/ai/flows/legal-advice-summary";
import { transcribeAudio, TranscribeAudioInput, TranscribeAudioOutput } from "@/ai/flows/speech-to-text";

export async function askLegalChatbot(input: LegalQueryChatbotInput): Promise<LegalQueryChatbotOutput> {
  try {
    const response = await legalQueryChatbot(input);
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Chatbot request was cancelled on the server.');
      throw error;
    }
    console.error("Error in askLegalChatbot action:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get a response from the legal chatbot: ${error.message}`);
    }
    throw new Error("Failed to get a response from the legal chatbot due to an unknown error.");
  }
}

export async function getChatTitle(input: LegalAdviceSummaryInput): Promise<string> {
  try {
    if (!input.advice || input.advice.trim().length === 0) {
      return "New Chat";
    }
    const { summary } = await legalAdviceSummary(input);
    return summary;
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Chat";
  }
}

export async function transcribeAudioAction(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
    return await transcribeAudio(input);
}
