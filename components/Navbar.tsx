import { logoutRedirect } from "@/utils/auth/logout-redirect";
import { useRouter } from "next/router";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    await logoutRedirect(router);
  };

  return (
    <nav className="flex p-4 bg-white mx-auto max-w-full border-b border-gray-200 justify-between">
      <Image src="/coherent-logo.svg" alt="Coherent" width={175} height={175} />
    </nav>
  );
};

export default Navbar;
