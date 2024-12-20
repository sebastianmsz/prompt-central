"use client";
import React, { useState } from "react";
import Image from "next/image";
import { PromptCardProps as Props } from "@types";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const PromptCard: React.FC<Props> = ({
	post,
	handleTagClick,
	handleEdit,
	handleDelete,
	isProfilePage,
}) => {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [copied, setCopied] = useState("");
	const { data: session } = useSession() as { data: Session | null };

	const isCurrentUserPost = session?.user?.id === post.creator?._id;

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => {
			setCopied("");
		}, 2000);
	};

	const handleDeleteClick = async () => {
		setIsModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		setIsModalOpen(false);
		setDeleting(true);
		try {
			if (post._id) {
				await handleDelete?.(post._id);
			} else {
				throw new Error("Post id is missing");
			}
		} catch (error) {
			console.error("An error ocurred:", error);
		} finally {
			setDeleting(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="flex flex-col gap-4 p-4 shadow-md rounded-lg bg-white overflow-hidden">
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onConfirm={handleConfirmDelete}
				title="Confirm Delete"
				message="Are you sure you want to delete this post?"
			/>
			<div className="flex justify-between items-start gap-5 flex-wrap">
				<Link
					href={`/profile/${post.creator?._id}`}
					className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
				>
					<Image
						src={post.creator?.image || "/assets/img/default-user.svg"}
						alt="User image"
						width={40}
						height={40}
						className="rounded-full object-contain"
					/>
					<div className="flex flex-col">
						<h3 className="font-satoshi font-semibold text-gray-900 truncate">
							{post.creator?.name || "Unknown User"}
						</h3>
						<p className="font-inter text-sm text-gray-500 break-words max-w-full">
							{post.creator?.email || "No email"}
						</p>
					</div>
				</Link>
				<div
					onClick={handleCopy}
					className="w-7 h-7 rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer"
				>
					<Image
						src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
						alt="Copy icon"
						width={20}
						height={20}
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
			{isProfilePage && isCurrentUserPost && (
				<div className="flex justify-end gap-2">
					<button
						onClick={handleEdit}
						className="px-3 py-1 bg-blue-500 text-white rounded-md"
					>
						Edit
					</button>
					<button
						onClick={handleDeleteClick}
						disabled={deleting}
						className="px-3 py-1 bg-red-500 text-white rounded-md"
					>
						{deleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			)}
		</div>
	);
};

export default PromptCard;
