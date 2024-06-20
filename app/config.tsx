export const host = process.env.NEXT_PUBLIC_API_ROOT;
export const authRedirectTo = process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO;
export const authRedirectBack = process.env.NEXT_PUBLIC_AUTH_REDIRECT_FROM;
export const showDemoSpace =
  process.env.NEXT_PUBLIC_SHOW_DEMO_SPACE === "true" ? true : false;

export const getApiUrl = () => {
  return host;
};
