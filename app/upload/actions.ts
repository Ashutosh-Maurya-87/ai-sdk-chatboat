"use server"

import { db } from "@/lib/db-config"; // Import the database instance
import { documents } from "@/lib/db-schema"; // Import the documents table schema
import { generateEmbeddings } from "@/lib/embeddings"
import { chunkContent } from "@/lib/chunking"
import PDFParser from "pdf2json";

export async function processPdfFile(formData: FormData) {
    try {
        const file = formData.get("pdfFile") as File;
        if (!file) throw new Error("No file uploaded");

        // Convert ArrayBuffer to Node.js Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF using pdf2json wrapped in a Promise
        const extractedText = await new Promise<string>((resolve, reject) => {
            const pdfParser = new PDFParser(null, true); // true = extract raw text content

            pdfParser.on("pdfParser_dataError", (errData: any) => {
                reject(errData.parserError);
            });

            pdfParser.on("pdfParser_dataReady", () => {
                const rawText = pdfParser.getRawTextContent();
                resolve(rawText);
            });

            pdfParser.parseBuffer(buffer);
        });

        // if pdf is empty or only have images, return error
        if (!extractedText || extractedText.trim() === "") {
            return {
                status: false,
                error: "The PDF file is empty or does not contain any text."
            }
        }

        const chunks = await chunkContent(extractedText);
        const embeddings = await generateEmbeddings(chunks);

        // create array of records in which each records contains the chunk, 
        // its embedding and the source file name
        const records = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index],
            source: file.name
        }))

        await db.insert(documents).values(records)

        return {
            success: true,
            message: `Created ${records.length} records for the PDF file: ${file.name} to searchable chunks`
        }

    } catch (error) {
        console.log('error while processing pdf file:', error)
        return {
            status: false,
            error: "Failed to process the PDF file. Please try again."
        }
    }
}