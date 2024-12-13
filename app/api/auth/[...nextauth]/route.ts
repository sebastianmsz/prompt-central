import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDb } from "@utils/database";
import { Session, Profile } from "next-auth";
import { User as NextAuthUser } from "next-auth";

const handler = NextAuth({
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ session }: { session: Session }): Promise<Session> {
			await connectToDb();
			const sessionUser = await User.findOne({ email: session.user?.email });

			if (!sessionUser) {
				throw new Error("User not found in database");
			}

			return {
				...session,
				user: {
					...session.user,
					id: sessionUser._id.toString(),
					username: sessionUser.username,
					image: sessionUser.image,
				},
			};
		},
		async signIn({ profile }: { profile?: Profile }): Promise<boolean> {
			try {
				await connectToDb();
				if (profile && profile.email) {
					const userExists = await User.findOne({ email: profile.email });
					if (!userExists) {
						let username =
							profile.name?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ||
							profile.email.split("@")[0];
						const userCount = await User.countDocuments({});
						if (userCount > 0) {
							username += userCount;
						}
						await User.create({
							email: profile.email,
							username: username,
							image: profile.picture,
						});
					}
				}
				return true;
			} catch (error) {
				console.error("Error during sign in:", error);
				return false;
			}
		},
	},
});

export { handler as GET, handler as POST };
