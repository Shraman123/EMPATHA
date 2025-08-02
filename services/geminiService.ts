
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

if (!process.env.API_KEY) {
    // In a real app, you'd handle this more gracefully.
    // For this context, we assume the key is present.
    console.warn("API_KEY environment variable is not set. The app will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || " " });

export function createChat(): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });
}
