import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 150, // each chunk will have a maximum of 150 characters
    chunkOverlap: 20, // each chunk will overlap (repeat the last few characters of the previous chunk at the beginning of the next chunk) with the previous chunk by 20 characters
    lengthFunction: (text) => text.length, // function to calculate the length of the text
    separators: [" "] // Instead of blindly slicing a string mid-word (like cutting "Frontend" into "Fron" and "tend"), it waits until it hits a space.
})

// This asynchronous function takes a raw string of text, splits it into smaller chunks based on the textSplitter configuration, and returns an array of string chunks.
export async function chunkContent(content: string) {
    return await textSplitter.splitText(content)
}