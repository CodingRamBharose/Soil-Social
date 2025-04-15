import NextAuth from "next-auth";
import { options } from "./options";  // Ensure correct import path

const handler = NextAuth(options);

export { handler as GET, handler as POST };
