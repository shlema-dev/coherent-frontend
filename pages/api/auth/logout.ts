import { NextApiRequest, NextApiResponse } from "next";
import { getApiUrl } from "@/app/config";
import axios from "axios";
import { handleGetSessionID } from "@/utils/auth/handle-get-sess-id";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apiUrl = getApiUrl();
  const { sessId } = req.body;

  try {
    const response = await axios.delete(`${apiUrl}/auth`, {
      headers: {
        "x-session-id": sessId,
      },
    });
    if (response.status !== 200) {
      console.error(
        "API returned non-200 status:",
        response.status,
        response.data,
      );
      return res.status(500).json({ message: "Logout failed at API" });
    }

    res.setHeader("Set-Cookie", [
      "UserSessionID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "RefreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "Expiration=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
