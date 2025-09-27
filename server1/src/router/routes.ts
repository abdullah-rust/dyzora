import { Router } from "express";
import passport from "passport";
import { createAccessToken, createRefreshToken } from "../utils/jwt";
import Me from "../controllers/check/me";
import { passport_f } from "../controllers/auth/google_login";
import { Login } from "../controllers/auth/login";
import { Signup } from "../controllers/auth/signup";
import {
  validateLogin,
  validateSignup,
  LoginSchema,
  SignupSchema,
} from "../controllers/auth/help";
import { Get_Profile } from "../profile/get_profile";
import { CheckJwt } from "../middleware/check_jwt";
import {
  Add_adsress,
  validate,
  add_address_schema,
} from "../profile/add_address";
import { Get_Address } from "../profile/get_addres";
import { Delete_Address } from "../profile/delete_address";
import multer from "multer";
import { addProduct } from "../admin/add_products";

const router = Router();

passport_f;

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/auth/me", Me);
router.post("/auth/login", validateLogin(LoginSchema), Login);
router.post("/auth/signup", validateSignup(SignupSchema), Signup);
router.get("/profile/", CheckJwt, Get_Profile);
router.post(
  "/add-address",
  CheckJwt,
  validate(add_address_schema),
  Add_adsress
);
router.get("/get-address", CheckJwt, Get_Address);
router.delete("/delete-address/:id", CheckJwt, Delete_Address);
router.post("/admin/add-product", upload.array("images", 10), addProduct);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res): Promise<any | any> => {
    // ✅ req.user me user object available hai
    const user: any = req.user;

    // 🔑 JWT generate karna
    const accessToken = await createAccessToken(user.id);
    const refreshToken = await createRefreshToken(user.id);

    if (!accessToken || !refreshToken) {
      return res.send(500).json({ message: "Internal Server Error" });
    }

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });

    res.redirect("http://localhost/profile");

    // 🔹 Option 2: Cookie me set karke redirect (secure, frontend handle karega)
    // res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15*60*1000 });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7*24*60*60*1000 });
    // res.redirect("http://frontend-app.com/dashboard");
  }
);

export default router;
