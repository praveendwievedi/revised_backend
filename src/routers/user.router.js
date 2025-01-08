import { Router } from "express";
const router=Router();
import { registerUser ,logoutUser, loginUser} from "../controller/user.controller.js";
import userAuthenticate from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router.route('/register').post(upload.fields(
    [
        {
            name: 'avatar',
            maxCount:1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]
),registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(userAuthenticate,logoutUser)

export default router