// Get the session id from browser cookies
import { parse } from "cookie";

export default async function (req: any, res: any) {
  if (!req.headers.cookie) {
    return res.status(401).json({ message: "No session ID found" });
  }

  const cookies = parse(req.headers.cookie);
  const sessid = cookies.UserSessionID;

  if (sessid) {
    return res.json({ sessid: sessid });
  } else {
    return res.status(401).json({ message: "No session ID found" });
  }
}
