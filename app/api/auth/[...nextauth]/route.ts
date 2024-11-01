import { authOptions } from "@/helpers/authOptions";
import NextAuth from "next-auth";

//ignore ts error
// @ts-ignore

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
