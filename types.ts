import { Session, User } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: User;
	}
	interface User {
		username: string;
	}
	interface Profile {
		username: string;
		picture: string; // Add the picture property here
	}
}

export interface Post {
	_id?: string;
	prompt: string;
	tag: string;
	creator?: User | null;
}

export type CreatePost = Omit<Post, "_id" | "creator">;

export interface FeedProps {
	handleTagClick: (tag: string) => void;
}

export interface PromptCardListProps {
	post: Post;
	handleTagClick?: (tag: string) => void;
}

export interface FormProps {
	type: "Create" | "Edit";
	post: Partial<CreatePost>;
	setPost: (post: Partial<CreatePost>) => void;
	submitting: boolean;
	handleSubmit: (e: React.FormEvent) => void;
}

export interface ProviderProps {
	session: Session | null | undefined;
	children: React.ReactNode;
}
