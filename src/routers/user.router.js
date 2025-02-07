import { Router } from "express";
const router=Router();
import { registerUser ,logoutUser, loginUser ,refreshAccessToken,
    updateUserAvatar,updateUserPassword, getChannelDetails} from "../controller/user.controller.js";
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

router.route('/refresh-token').post(refreshAccessToken)

//secure routes
router.route('/logout').post(userAuthenticate,logoutUser)
router.route('/update-password').patch(userAuthenticate,updateUserPassword)
router.route('/update-avatar').patch(userAuthenticate,upload.single("avatar"),updateUserAvatar)
router.route('/channel-details').post(userAuthenticate,getChannelDetails)

export default router