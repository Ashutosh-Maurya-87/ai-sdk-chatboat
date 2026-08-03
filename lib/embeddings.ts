import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai"

export async function generateEmbedding(text: string) {
    const input = text.replace("\n", " ")

    // 
    const { embedding } = await embed({
        model: openai.textEmbeddingModel("text-embedding-3-small"),
        value: input
    })

    return embedding
}

// For generating embeddings for multiple texts at once, 
// which is more efficient than generating them one by one.
export async function generateEmbeddings(texts: string[]) {
    const input = texts.map((text) => text.replace("\n", " "))

    // 
    const { embeddings } = await embedMany({
        model: openai.textEmbeddingModel("text-embedding-3-small"),
        values: input
    })

    return embeddings
}