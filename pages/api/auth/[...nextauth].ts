import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://maestro-api-dev.secil.biz/Auth/Login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "YOUR_SECRET_TOKEN",
          },
          body: JSON.stringify({
            username: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (data?.status === 0 && data?.data?.accessToken) {
          return {
            id: credentials?.email,
            email: credentials?.email,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          };
        }
        // Hatalı durumda mesajı fırlat
        throw new Error(JSON.stringify({ message: data?.message || "Giriş başarısız." }));
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
