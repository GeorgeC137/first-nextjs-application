import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connect from "@/utils/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials, req) {
        await connect();

        try {
          const user = await User.findOne({
            email: credentials.email
          });

          if (user) {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
              return user;
            } else {
              throw new Error("Invalid password");
            }
          } else {
            throw new Error("No user found with this email");
          }
        } catch (error) {
          console.log("Error in credentials authorize:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    error: "/dashboard/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("NEXTAUTH signIn callback:", { 
        user: { name: user.name, email: user.email }, 
        account: account?.provider,
        profile: profile?.email 
      });
      
      // Allow all sign-ins
      return true;
    },
    async jwt({ token, user, account, profile }) {
      console.log("NEXTAUTH jwt callback:", { 
        hasUser: !!user, 
        hasAccount: !!account,
        accountProvider: account?.provider 
      });
      
      if (user) {
        token.user = { 
          name: user.name, 
          email: user.email, 
          id: user.id ?? user.sub,
          image: user.image 
        };
      }
      
      if (account) {
        token.accessToken = account.access_token;
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("NEXTAUTH session callback:", { 
        sessionExists: !!session, 
        hasTokenUser: !!token?.user 
      });
      
      if (token?.user) {
        session.user = token.user;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("NEXTAUTH redirect callback:", { url, baseUrl });
      
      // If url is relative, prepend baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // If url is on the same origin as baseUrl, allow it
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        if (urlObj.origin === baseUrlObj.origin) return url;
      } catch (e) {
        console.error("URL parsing error:", e);
      }
      
      // Default to dashboard after sign-in
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn(message) {
      console.log("NEXTAUTH event signIn:", message);
    },
    async signOut(message) {
      console.log("NEXTAUTH event signOut:", message);
    },
    async createUser(message) {
      console.log("NEXTAUTH event createUser:", message);
    },
    async linkAccount(message) {
      console.log("NEXTAUTH event linkAccount:", message);
    },
    async session(message) {
      console.log("NEXTAUTH event session:", message);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };