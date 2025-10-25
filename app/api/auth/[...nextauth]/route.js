import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { Pool } from "pg"

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        // const res = await pool.query(
        //   "SELECT id, email, name FROM users WHERE email = $1 AND password = crypt($2, password)",
        //   [credentials.username, credentials.password]
        // );
        const res = await pool.query(
            "SELECT id, email, name FROM users WHERE name = $1 AND password = $2",
            [credentials.username, credentials.password]
        );
        console.log(credentials)
        if (res.rowCount === 1) {
          const user = res.rows[0];
          return { id: user.id, email: user.email, name: user.name };
        }

        return null; // authentication failed
      },
    }),
  ],
};

const authHandler = NextAuth(authOptions);

// Export GET and POST functions for Next.js route handlers
export const GET = authHandler;
export const POST = authHandler;