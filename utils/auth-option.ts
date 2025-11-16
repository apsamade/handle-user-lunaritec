import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import { connectToDB } from "./connect-to-db";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions = {
	pages: {
		signIn: "/login",
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				name: { label: "Name", type: "text", placeholder: "J Smith" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
				await connectToDB();
				console.log("Credentials:", credentials);
				const user = await User.findOne({ name: credentials?.name });
				console.log(user, (await bcrypt.compare(credentials?.password!, user.password!)));

				if (user && (await bcrypt.compare(credentials?.password!, user.password!))) {
					console.log("User found and password matches:", user);
					return {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						image: user.image
					}
				} else {
					await User.create({
						name: credentials?.name,
						email: `${credentials?.name}@example.com`,
						password: await bcrypt.hash(credentials?.password!, 10)
					});	
					return null
				}
			}
		})
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }: any) {
			if (account.provider === "credentials") {
				console.log("Signing in with credentials:", credentials);
				await connectToDB();
				const user = await User.findOne({ name: credentials?.name });
				if(user && (await bcrypt.compare(credentials?.password, user.password!))) {
					return true;
				}
				return false;
			}
			return true;
		},
		async session({ session, token, user }: any) {
			return session;
		}
	}
};

export const GetAuthServerSession = async () => await getServerSession(authOptions);