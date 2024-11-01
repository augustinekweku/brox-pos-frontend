import { AuthOptions, User } from "next-auth";
import { getSessionMaxAge } from ".";
import GoogleProvider from "next-auth/providers/google";
import DI from "@/di-container";

interface AditionalUserDBCredentials {
  verified?: boolean;
  onboarded?: boolean;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: getSessionMaxAge(),
  },

  pages: {
    signIn: "/login",
    error: "/auth/access-denied", // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  callbacks: {
    async signIn({ user }: { user: User & AditionalUserDBCredentials }) {
      try {
        const response = await DI.authService.getOrCreateUser({
          email: user.email!,
          name: user.name!,
        });
        user.verified = response.verified;
        user.onboarded = response.onboarded;
        console.log("response in signIn", response);
        if (response) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      session.token = token;
      console.log("session in session", session);
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user || trigger === "update") {
        const response = await DI.authService.getOrCreateUser({
          email: user.email!,
          name: user.name!,
        });
        console.log("response in jwt", response);
        token = {
          ...token,
          ...response,
        };
      }

      return token;
    },
  },
  // events: {
  //   async signIn(message) {
  //     console.log("signIn", message);
  //   },
  // },
};
