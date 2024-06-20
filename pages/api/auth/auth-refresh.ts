import { serialize } from "cookie";
import axios from "axios";
import { parse } from "cookie";
import { getApiUrl } from "@/app/config";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export default async function authRefresh(req: any, res: any) {
  const { sessionId } = req.body;
  console.log("authRefresh called"); // Debug log

  const apiUrl = getApiUrl();

  try {
    const cookies = parse(req.headers.cookie || "");
    console.log("Cookies: ", cookies);
    const { RefreshToken: refreshToken } = cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    const response = await axios.put(
      `${apiUrl}/auth`,
      { key: refreshToken },
      {
        headers: {
          "x-session-id": sessionId,
        },
      }
    );

    const { sessid, exp, refresh: newRefresh } = response.data;

    const cookiesToSet = [
      serialize("UserSessionID", sessid, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }),
      serialize("Expiration", exp, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }),
      serialize("RefreshToken", newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }),
    ];

    res.setHeader("Set-Cookie", cookiesToSet);
    res.status(200).json({ message: "Successfully refreshed session", exp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to refresh session" });
  }
}
