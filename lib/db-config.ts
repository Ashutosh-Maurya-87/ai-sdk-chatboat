import {drizzle} from "drizzle-orm/neon-http";
import {neon} from "@neondatabase/serverless";
import {config} from "dotenv"

// to set database connection string from .env.local file
config({path: ".env.local"})

// create a neon client using the connection string from the environment variable
const sql = neon(process.env.NEON_DATABASE_URL!);

// create a drizzle instance using the neon client
export const db = drizzle(sql); 
