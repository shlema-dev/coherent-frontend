import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "./Button";
import { logoutRedirect } from "@/utils/auth/logout-redirect";
import {
  Carbon,
  Layers,
  Lifesaver,
  Logout,
  Settings,
} from "@carbon/icons-react";

const Sidebar = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    await logoutRedirect(router);
  };

  const goToSpaces = () => {
    router.push("/");
  };

  const goToSources = () => {
    router.push("/sources/overview");
  };

  return (
    <aside className="w-60 h-full p-4 flex flex-col fixed inset-y-0 overflow-auto gap-5 border-r border-gray-6">
      <div className="flex justify-start mt-4 mb-8">
        <Image
          src="/coherent-logo.svg"
          alt="Coherent"
          width={175}
          height={175}
        />
      </div>
      {/* Main Menu */}
      <div className="flex flex-col items-start gap-1">
        <Button intent={"sidebar"} size={"large"} onClick={goToSpaces}>
          <Carbon size={20} />
          Spaces
        </Button>
        <Button intent={"sidebar"} size={"large"} onClick={goToSources}>
          <Layers size={20} />
          Sources
        </Button>
      </div>
      {/* Settings and Support */}
      <div className="flex flex-col items-start gap-1 mt-auto">
        <Button intent={"sidebar"} size={"large"}>
          <Settings size={20} />
          Settings
        </Button>
        <Button intent={"sidebar"} size={"large"}>
          <Lifesaver size={20} /> Support
        </Button>
      </div>
      <hr />
      {/* User stuff */}
      <div className="mb-4">
        <Button
          intent={"sidebar"}
          size={"large"}
          className="border border-gray-7 flex justify-between"
          onClick={handleLogOut}
        >
          Sign out
          <Logout size={20} />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
