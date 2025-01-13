"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { PromptCardProps as Props } from "@types";
import { useSession, signIn } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "@node_modules/next/link";

const PromptCard: React.FC<Props> = ({
	post,
	handleTagClick,
	isProfilePage,
	onDelete,
}) => {
	const { data: session } = useSession() as { data: Session | null };
	const [isMaximized, setIsMaximized] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [copied, setCopied] = useState("");
	const [deleting, setDeleting] = useState(false);
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);

	const isCurrentUserPost = session?.user?.id === post.creator?._id;

	const handleCopy = () => {
		setCopied(post.prompt);
		navigator.clipboard.writeText(post.prompt);
		setTimeout(() => {
			setCopied("");
		}, 2000);
	};

	const handleDeleteClick = async () => {
		setIsDeleteModalOpen(true);
	};

	const handleConfirmDelete = async () => {
		setIsDeleteModalOpen(false);
		setDeleting(true);
		try {
			if (post._id && onDelete) {
				onDelete(post._id, true);
				const response = await fetch(`/api/prompt/${post._id}`, {
					method: "DELETE",
				});
				if (!response.ok) {
					throw new Error(`An error has occurred: ${response.status}`);
				}
			} else {
				throw new Error("Post id is missing or onDelete not provided");
			}
		} catch (error) {
			console.error("An error occurred:", error);
			if (post._id) {
				onDelete?.(post._id, false);
			}
		} finally {
			setDeleting(false);
		}
	};

	const handleEdit = useCallback(() => {
		if (session?.user && post._id) {
			router.push(`/edit-prompt?id=${post._id}`);
		} else {
			signIn("google");
		}
		setIsMaximized(false);
	}, [router, session, post]);

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
	};

	const handleMaximize = () => {
		setIsMaximized(true);
	};

	const handleCloseMaximize = () => {
		setIsMaximized(false);
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (backdropRef.current && backdropRef.current === event.target) {
			handleCloseMaximize();
		}
	}, []);

	useEffect(() => {
		if (isMaximized) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMaximized, handleClickOutside]);

	const renderUserInfo = () => (
		<Link
			href={`/profile/${post.creator?._id}`}
			className="flex w-full max-w-[70%] cursor-pointer items-center gap-3"
			onClick={(event) => event.stopPropagation()}
		>
			<Image
				src={post.creator?.image || "/assets/img/default-user.svg"}
				alt="user_image"
				width={40}
				height={40}
				className="rounded-full object-contain"
			/>
			<div className="min-w-0 flex-1">
				<h3 className="truncate font-satoshi font-semibold text-gray-900">
					{post.creator?.name}
				</h3>
				<p className="truncate font-inter text-sm text-gray-500">
					{post.creator?.email}
				</p>
			</div>
		</Link>
	);

	const renderButtons = () =>
		isProfilePage &&
		isCurrentUserPost && (
			<div className="mt-4 flex justify-end gap-2">
				<button
					onClick={(event) => {
						event.stopPropagation();
						handleEdit();
					}}
					className="rounded-md bg-blue-500 px-3 py-1 text-white"
				>
					Edit
				</button>
				<button
					onClick={(event) => {
						event.stopPropagation();
						handleDeleteClick();
					}}
					disabled={deleting}
					className="rounded-md bg-red-500 px-3 py-1 text-white"
				>
					{deleting ? "Deleting..." : "Delete"}
				</button>
			</div>
		);

	const renderContent = (isModal = false) => (
		<>
			<div className="flex flex-wrap items-start justify-between gap-5">
				{renderUserInfo()}
				<div className="flex items-center gap-2">
					<div
						onClick={(event) => {
							event.stopPropagation();
							handleCopy();
						}}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur"
					>
						<Image
							src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
							alt="Copy icon"
							width={20}
							height={20}
						/>
					</div>
					{isModal && (
						<button
							onClick={handleCloseMaximize}
							className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="h-6 w-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>
			</div>
			<p
				className={`my-4 break-words font-satoshi text-sm text-gray-700 ${
					isModal
						? "max-h-[40vh] overflow-auto"
						: "max-h-10 overflow-hidden text-ellipsis"
				}`}
				style={
					isModal
						? {}
						: {
								WebkitLineClamp: 2,
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
							}
				}
			>
				{post.prompt}
			</p>
			<p
				className="blue_gradient cursor-pointer truncate font-inter text-sm"
				onClick={(event) => {
					event.stopPropagation();
					handleTagClick?.(post.tag);
					if (isModal) handleCloseMaximize();
				}}
			>
				{post.tag}
			</p>
			{renderButtons()}
		</>
	);

	return (
		<>
			{isDeleteModalOpen && (
				<div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-4">
					<div className="w-full max-w-[95%] rounded-md bg-white p-4 shadow-lg sm:w-96 sm:max-w-none sm:p-6">
						<h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">
							Confirm Delete
						</h2>
						<p className="mb-4 text-sm sm:mb-6 sm:text-base">
							Are you sure you want to delete this post?
						</p>
						<div className="flex justify-end gap-2 sm:gap-4">
							<button
								onClick={handleCloseDeleteModal}
								className="rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 sm:px-4 sm:py-2 sm:text-base"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmDelete}
								className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 sm:px-4 sm:py-2 sm:text-base"
							>
								Confirm Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<div
				className="flex cursor-pointer flex-col gap-4 overflow-hidden rounded-lg bg-white p-4 shadow-md"
				onClick={handleMaximize}
				ref={backdropRef}
			>
				{renderContent()}
			</div>

			{isMaximized && (
				<div
					className="fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-4"
					ref={backdropRef}
				>
					<div
						className="relative max-h-[95%] w-full max-w-[95%] overflow-auto rounded-lg bg-white shadow-lg sm:w-auto sm:max-w-[80%]"
						ref={modalRef}
					>
						<div className="p-4 sm:p-6">{renderContent(true)}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PromptCard;
