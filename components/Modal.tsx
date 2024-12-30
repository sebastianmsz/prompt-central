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
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-6 rounded-md shadow-lg w-96">
				<h2 className="text-xl font-bold mb-4">{title}</h2>
				<p className="mb-6">{message}</p>
				<div className="flex justify-end gap-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
					>
						Confirm Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;