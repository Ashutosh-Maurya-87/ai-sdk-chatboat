import { pgTable, serial, text, timestamp, vector, index } from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(), // store actual text chunk of pdf or document
    embedding: vector("embedding", { dimensions: 1536 }).notNull(), // store embedding vector of the text chunk
    source: text("source").notNull(), // store the source of the document (e.g., file name, URL)
    created_at: timestamp("created_at").defaultNow().notNull()
},
    (table) => [
        index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops"))
    ]
)

export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;