import { Session } from "next-auth";

export interface User {
	id: string;
	username?: string;
	email?: string;
	image?: string;
}

export interface Post {
	_id?: string;
	prompt: string;
	tag: string;
	creator?: User;
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
