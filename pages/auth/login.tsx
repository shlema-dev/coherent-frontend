import { Button } from "@/components/Button";
import { handleLogin } from "@/utils/auth/handle-login";
import { redirectToOAuth } from "@/utils/auth/redirect-oath";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    handleLogin(router);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    redirectToOAuth();
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="flex flex-col justify-center items-center flex-shrink-0"
        style={{ minWidth: "450px", maxWidth: "600px", flex: "1" }}
      >
        <div>
          <Image
            src="/coherent-logo.svg"
            alt="Coherent"
            width={300}
            height={300}
          />
          <h1 className="text-start font-semibold text-2xl mt-8 mb-2 text-brand-500">
            Sign in
          </h1>
          <p className="text-start mb-10">Sign in with your Gmail address.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button
              type="submit"
              intent={"outline"}
              size={"large"}
              imgSrc="/google-logo.svg"
              className="flex justify-center items-center"
            >
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>
      <div className="flex flex-1 login-gradient">
        {/* Empty div with gradient background */}
      </div>
    </div>
  );
}

Login.noLayout = true;
