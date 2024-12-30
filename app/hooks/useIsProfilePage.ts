import { usePathname } from "next/navigation";

const useIsProfilePage = () => {
	const pathname = usePathname();
	return pathname === "/profile";
};

export default useIsProfilePage;