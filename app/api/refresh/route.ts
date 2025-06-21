// 🔁 Refresh token
export async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "test";
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.collection("users").findOne(
      { googleId: decoded.userId },
      {
        projection: {
          googleId: 1,
          name: 1,
          email: 1,
          picture: 1,
          status: 1,
          unanswered: 1,
        },
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      userId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      status: user.status,
      unanswered: user.unanswered || [],
    };

    const newAccessToken = jwt.sign(userData, JWT_SECRET, { expiresIn: "15m" });

    return res.json({
      accessToken: newAccessToken,
      userData,
    });
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("user_data");
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}
