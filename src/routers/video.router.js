import { Router } from "express";
import {publishAVideo} from '../controller/video.controller.js'
import {userAuthenticate,upload} from '../middlewares/middlewareJunctions.js'

const router=Router();
router.route('/uploadvideo').post(userAuthenticate,upload.fields([
    {
        name:'video',
        maxCount:1
    },
    {
        name:'thumbnail',
        maxCount:1
    }
]),publishAVideo)


export default router;