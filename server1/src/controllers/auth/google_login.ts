import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import pool from "../../clients/pg"; // PostgreSQL pool

dotenv.config();

export const passport_f = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"]!,
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"]!,
      callbackURL: "/api/user/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const providerId = profile.id;
        const name = profile.displayName;

        // 1️⃣ Check if user exists
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1 OR provider_id = $2",
          [email, providerId]
        );

        let user;

        if (rows.length > 0) {
          // 2️⃣ User exists
          user = rows[0];
          console.log("User already exists:", user);
        } else {
          // 3️⃣ Insert new user
          const insertResult = await pool.query(
            `INSERT INTO users (name, email, provider, provider_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, "google", providerId]
          );

          user = insertResult.rows[0];
          console.log("New user created:", user);
        }

        // 4️⃣ Return user to Passport
        return done(null, user);
      } catch (err) {
        console.error("Error in Google strategy:", err);
        return done(err, null);
      }
    }
  )
);
