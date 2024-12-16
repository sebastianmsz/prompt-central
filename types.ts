import { Session, User } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: User & { _id: string };
	}
	interface User {
		_id: string;
	}
	interface Profile {
		picture?: string;
	}
}

export interface Post {
	_id?: string;
	prompt: string;
	tag: string;
	creator?: User | null;
}

export type CreatePost = Partial<Post>;

export interface FeedProps {
	handleTagClick: (tag: string) => void;
}

export interface PromptCardProps {
	post: Post;
	handleEdit: () => void;
	handleDelete: () => void;
	handleTagClick: (tag: string) => void;
	isCurrentUserProfile: boolean;
	isProfilePage: boolean;
}

export interface FormProps {
	type: "Create" | "Edit";
	post: Partial<CreatePost>;
	setPost: (post: Partial<CreatePost>) => void;
	submitting: boolean;
	handleSubmit: (e: React.FormEvent) => void;
}

export type ProviderProps = React.PropsWithChildren<{
	session?: Session | null;
}>;

export interface UserProfileParams {
	[key: string]: string;
	id: string;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
}

export interface ProfileProps {
	name: string;
	desc: string;
	data: Post[];
	isCurrentUserProfile: boolean;
	handleEdit: (id: string) => void;
	handleDelete: (id: string) => void;
	isProfilePage: boolean;
}
