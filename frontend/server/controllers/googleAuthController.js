const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const pool = require("../config/db");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    // Verify Google credential
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || "Google User";
    const picture = payload.picture || null;

    if (!email) {
      return res.status(400).json({
        message: "Google account email not found.",
      });
    }

    // Find existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    let user;

    if (existingUser.rows.length > 0) {
      // Existing account
      user = existingUser.rows[0];

      // Save Google information
      const updatedUser = await pool.query(
        `
        UPDATE users
        SET google_id = $1,
            profile_picture = $2
        WHERE email = $3
        RETURNING *
        `,
        [googleId, picture, email]
      );

      user = updatedUser.rows[0];
    } else {
      // New Google account
      const randomPassword = await bcrypt.hash(
        `${googleId}-${Date.now()}`,
        10
      );

      const newUser = await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          role,
          google_id,
          profile_picture
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
          name,
          email,
          randomPassword,
          "customer",
          googleId,
          picture,
        ]
      );

      user = newUser.rows[0];
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Google authentication successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);

    return res.status(500).json({
      message: "Google authentication failed.",
    });
  }
};

module.exports = {
  googleAuth,
};