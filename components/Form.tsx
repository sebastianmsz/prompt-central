import React from "react";
import Link from "next/link";
import { FormProps } from "@types";

function Form({ type, post, setPost, submitting, handleSubmit }: FormProps) {
	const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const tags = e.target.value.split(",").map((tag) => tag.trim());
		setPost({ ...post, tag: tags });
	};

	return (
		<section className="flex-start w-full max-w-full flex-col">
			<h1 className="head_text text-left">
				<span className="blue_gradient">{type} Post</span>
			</h1>
			<p className="desc max-w-md text-left">
				{type} and share amazing prompts with the world, and let your
				imagination run wild with any AI-powered platform.
			</p>
			<form
				onSubmit={handleSubmit}
				className="max-w-2x1 glassmorphism mt-10 flex w-full flex-col gap-7"
			>
				<label>
					<span className="font-satoshi text-base font-semibold text-gray-700">
						Your Ai Prompt
					</span>
					<textarea
						value={post.prompt}
						onChange={(e) => setPost({ ...post, prompt: e.target.value })}
						placeholder="Write your prompt here..."
						required
						className="form_textarea"
					/>
				</label>
				<label>
					<span className="font-satoshi text-base font-semibold text-gray-700">
						Tags (comma-separated){" "}
						<span className="font_normal">
							(#product, #webdevelopment, #idea)
						</span>
					</span>
					<input
						value={post.tag ? post.tag.join(", ") : ""}
						onChange={handleTagChange}
						placeholder="#product, #webdevelopment, #idea"
						required
						className="form_input"
					/>
				</label>
				<div className="flex-end mx-3 mb-5 gap-4">
					<Link href="/" className="text-sm text-gray-500">
						Cancel
					</Link>
					<button
						className="rounded-full bg-primary-orange px-5 py-1.5 text-sm text-white"
						type="submit"
						disabled={submitting}
					>
						{submitting ? `${type}...` : type}
					</button>
				</div>
			</form>
		</section>
	);
}

export default Form;
