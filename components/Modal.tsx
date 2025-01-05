import React from "react";
import { ModalProps } from "@types";

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 px-4">
			<div className="w-full max-w-[95%] rounded-md bg-white p-4 shadow-lg sm:w-96 sm:max-w-none sm:p-6">
				<h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">{title}</h2>
				<p className="mb-4 text-sm sm:mb-6 sm:text-base">{message}</p>
				<div className="flex justify-end gap-2 sm:gap-4">
					<button
						onClick={onClose}
						className="rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-300 sm:px-4 sm:py-2 sm:text-base"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600 sm:px-4 sm:py-2 sm:text-base"
					>
						Confirm Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
