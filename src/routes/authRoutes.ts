const expressRoute = require("express");
const router = expressRoute.Router();
const { registerEmployee, loginUser, logout, getLoginHistory, updatePassword, getUser} = require("../controllers/authController.ts")
import { captureIp } from "../middleware/captureIp";
const {isAuthenticatedUser} = require("../middleware/auth.ts")

/* ====================== USER AUTHENTICATION ======================= */
router.route("/register/user").post(registerEmployee)
router.route("/login/user").post(captureIp, loginUser)
router.route("/logout").get(logout)
router.route("/user/login/history").get(isAuthenticatedUser, getLoginHistory)
router.route("/user/profile").get(isAuthenticatedUser, getUser)
router.route("/user/change/password").put(isAuthenticatedUser, updatePassword)

module.exports  = router