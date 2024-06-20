import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.cookie) {
    return res.status(401).json({ auth: false, message: "Redirect to login" });
  }

  const cookies = parse(req.headers.cookie);
  const sessid = cookies.UserSessionID;
  const exp = cookies.Expiration;

  if (sessid && exp) {
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in Unix timestamp format
    if (parseInt(exp) > currentTime) {
      return res.status(200).json({ auth: true });
    } else {
      return res
        .status(401)
        .json({ auth: false, message: "Session expired, redirect to login" });
    }
  } else {
    return res.status(401).json({ auth: false, message: "Redirect to login" });
  }
}
