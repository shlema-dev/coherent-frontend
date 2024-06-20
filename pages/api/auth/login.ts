import { serialize } from "cookie";

export default async function (req: any, res: any) {
  const { sessid, acctId, refresh, exp } = req.body;

  try {
    if (sessid && acctId && refresh && exp) {
      const cookiesToSet = [
        serialize("UserSessionID", sessid, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        }),
        serialize("AccountId", acctId, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        }),
        serialize("RefreshToken", refresh, {
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
      ];

      res.setHeader("Set-Cookie", cookiesToSet);
      res.status(200).json({ message: "Success" });
    } else {
      res.status(401).json({ message: "Invalid session or account ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to authenticate" });
  }
}
