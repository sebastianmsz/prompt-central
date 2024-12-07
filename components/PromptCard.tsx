"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PromptCardListProps } from "@types";

const PromptCard: React.FC<PromptCardListProps> = ({
	post,
	handleTagClick,
}) => {
	const [copied, setCopied] = useState<string>("");

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => setCopied(""), 3000);
	};

	return (
		<div className="flex flex-col gap-4 p-4 shadow-md rounded-lg bg-white overflow-hidden">
			<div className="flex justify-between items-start gap-5 flex-wrap">
				<div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
					<Image
						src={post.creator?.image || "/assets/img/default-user.svg"}
						alt="User image"
						width={40}
						height={40}
						className="rounded-full object-contain"
					/>
					<div className="flex flex-col">
						<h3 className="font-satoshi font-semibold text-gray-900 truncate">
							{post.creator?.username || "Unknown User"}
						</h3>
						<p className="font-inter text-sm text-gray-500 break-words max-w-full">
							{post.creator?.email || "No email"}
						</p>
					</div>
				</div>
				<div
					onClick={handleCopy}
					className="w-7 h-7 rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer"
				>
					<Image
						src={
							copied === post.prompt
								? "/assets/icons/tick.svg"
								: "/assets/icons/copy.svg"
						}
						width={12}
						height={12}
						alt="Copy"
					/>
				</div>
			</div>
			<p className="my-4 font-satoshi text-sm text-gray-700 break-words max-w-full text-ellipsis">
				{post.prompt}
			</p>
			<p
				className="font-inter text-sm blue_gradient cursor-pointer truncate"
				onClick={() => handleTagClick?.(post.tag)}
			>
				{post.tag}
			</p>
		</div>
	);
};

export default PromptCard;
