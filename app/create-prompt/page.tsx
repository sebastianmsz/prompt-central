"use client";

import React from "react";
import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";
import { Post } from "@types";
import { Session } from "next-auth";

const CreatePrompt = () => {
	const router = useRouter();
	const { data: session } = useSession() as { data: Session | null };

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [post, setPost] = useState<Partial<Post>>({
		prompt: "",
		tag: "",
	});

	const createPrompt = async (e: FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const response = await fetch("/api/prompt/new", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: post.prompt,
					userId: session?.user?.id,
					tag: post.tag,
				}),
			});

			if (response.ok) {
				router.push("/");
			} else {
				console.error("Failed to create prompt:", await response.text());
			}
		} catch (error) {
			console.error("An error occurred:", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Form
			type="Create"
			post={post as Post}
			setPost={(updatedPost) => setPost(updatedPost)}
			submitting={submitting}
			handleSubmit={createPrompt}
		/>
	);
};

export default CreatePrompt;
