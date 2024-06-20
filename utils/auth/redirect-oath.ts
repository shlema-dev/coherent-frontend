import { authRedirectBack, authRedirectTo } from "@/app/config";

export const redirectToOAuth = () => {
  try {
    const baseUrl = authRedirectTo!;
    const refValue = authRedirectBack!;
    const encodedRefValue = encodeURIComponent(refValue);
    const redirectToUrl = `${baseUrl}?ref=${encodedRefValue}`;

    window.location.href = redirectToUrl;
  } catch (error) {
    console.error("Error during Google OAuth redirect:", error);
  }
};
