import React, { useMemo, useCallback } from "react";
import PromptCard from "./PromptCard";
import { Post } from "@types";

interface ProfileProps {
	name: string;
	desc: string;
	data: Post[];
	handleEdit: (id: string) => void;
	handleDelete: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({
	name,
	desc,
	data,
	handleEdit,
	handleDelete,
}) => {
	const handleTagClick = useCallback((tag: string) => {
		console.log(`Tag clicked: ${tag}`);
	}, []);

	const memoizedPromptCards = useMemo(
		() =>
			data.map((prompt) => (
				<PromptCard
					key={prompt.id} // Ensure 'id' is the correct unique identifier
					post={prompt}
					handleEdit={() => handleEdit(prompt.id)}
					handleDelete={() => handleDelete(prompt.id)}
					handleTagClick={handleTagClick}
				/>
			)),
		[data, handleEdit, handleDelete, handleTagClick],
	);

	return (
		<section className="w-full">
			<h1 className="head_text text-left">
				<span className="blue_gradient">{name}</span>'s Profile
			</h1>
			<p className="desc text-left">{desc}</p>
			<div className="mt-10 prompt_layout">{memoizedPromptCards}</div>
		</section>
	);
};

export default Profile;
