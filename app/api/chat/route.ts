import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import {
    convertToModelMessages, streamText, UIMessage,
    tool, InferUITools, UIDataTypes, stepCountIs
} from "ai"
import { searchDocuments } from "@/lib/search"

const tools = {
    searchKnowledgeBaseTool: tool({
        description: "Search the knowledge base for relevant documents",
        inputSchema: z.object({
            query: z.string().min(1, "Query cannot be empty"),
            // limit: z.number().int().min(1).max(10).default(5),
        }),
        execute: async ({ query }) => {
            try {
                // console.log("=== TOOL EXECUTION STARTED ===");
                // console.log("Query:", query);
                // query: The query string to search for relevant documents in the knowledge base.
                // 3: The maximum number of relevant documents to return from the search.
                // 0.5: The similarity threshold for filtering relevant documents. Only documents with a similarity score above this threshold will be returned.
                const results = await searchDocuments(query, 5, 0.1);

                // console.log("=== CONTEXT SENT TO LLM ===", results);
                // console.log(results.map(doc => doc.content).join("\n\n"));

                if (results.length === 0) {
                    return "No relevant documents found in the knowledge base.";
                }

                const formattedResults = results.map((doc, index) => {
                    return `Document ${index + 1}:\nContent: ${doc.content}\nSimilarity Score: ${doc.similarity.toFixed(4)}\n`;
                }).join("\n\n");
                return formattedResults;
            } catch (error) {
                console.error('Error executing searchKnowledgeBaseTool:', error);
                return "Error occurred while searching the knowledge base.";
            }
        }
    })
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json()
        console.log("1. Incoming Messages Count:",messages, messages?.length);
        const result = streamText({
            model: openai("gpt-4.1-mini"),
            messages: await convertToModelMessages(messages),
            tools,
            system: `You are a helpful assistant with access to a knowledge base. 
                     When users ask questions, search the knowledge base for relevant information.
                     Always search before answering if the question might relate to uploaded documents.
                     Base your answers on the search results when available.
                     Give concise answers that correctly answer what the user is asking for. 
                     Do not flood them with all the information from the search results.`,
            stopWhen: stepCountIs(2),
        })
        // console.log('Chat result---->', result)
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error('failed to generate the response', error)
        return new Response("Internal Server Error", { status: 500 })
    }
}