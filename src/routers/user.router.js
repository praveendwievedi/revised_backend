import { Router } from "express";
const router=Router();
import { registerUser ,logoutUser, loginUser} from "../controller/user.controller.js";
import userAuthenticate from "../middlewares/auth.middleware.js";

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(userAuthenticate,logoutUser)

export default router