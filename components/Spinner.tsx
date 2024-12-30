import React from "react";

const Spinner: React.FC = () => {
	return (
		<div className="w-16 h-16 my-8 border-4 border-t-amber-500 border-gray-200 rounded-full animate-spin" />
	);
};

export default Spinner;