// Get the account ID from browser cookies
import { parse } from "cookie";

export default async function getAccountId(req: any, res: any) {
  if (!req.headers.cookie) {
    return res.status(401).json({ message: "No cookies found" });
  }

  const cookies = parse(req.headers.cookie);
  const acctId = cookies.AccountId;

  if (acctId) {
    return res.json({ acctId: acctId });
  } else {
    return res.status(401).json({ message: "No account ID found" });
  }
}
