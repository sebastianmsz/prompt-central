import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDb } from "@utils/database";
import { Session } from "next-auth";

const options: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
	],
	callbacks: {
		async session({ session }: { session: Session }) {
			if (session.user?.email) {
				const sessionUser = await User.findOne({
					email: session.user.email,
				});
				if (sessionUser) {
					session.user.id = sessionUser._id.toString();
				}
			}
			return session;
		},
		async signIn({ profile }: { profile: any }) {
			try {
				await connectToDb();
				const userExists = await User.findOne({
					email: profile.email,
				});

				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name.replace(" ", "").toLowerCase(),
						image: profile.picture,
					});
				}
				return true;
			} catch (error) {
				console.error("Error during sign-in:", error);
				return false;
			}
		},
	},
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
