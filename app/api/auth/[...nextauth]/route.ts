import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDb } from "@utils/database";
import { Session, Profile, Account, User as NextAuthUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

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
		async session({
			session,
			user,
		}: {
			session: Session;
			user: NextAuthUser;
		}): Promise<Session> {
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
				},
			};
		},
		async signIn({
			profile,
			account,
			user,
		}: {
			user: AdapterUser | NextAuthUser;
			account: Account | null;
			profile?: Profile;
		}): Promise<boolean> {
			try {
				await connectToDb();
				if (profile && profile.email) {
					const userExists = await User.findOne({ email: profile.email });
					if (!userExists) {
						let username =
							profile.name?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ||
							profile.email.split("@")[0];
						let userCount = await User.countDocuments({ username });
						if (userCount > 0) {
							username += userCount;
						}
						await User.create({
							email: profile.email,
							username: username,
							image: profile.image,
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
