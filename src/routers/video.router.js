import { Router } from "express";
import { publishAVideo
        ,deleteVideo
        ,getAllVideos
        ,updateVideo
        ,togglePublishStatus
        ,getVideoById
    } from '../controller/video.controller.js'
import {userAuthenticate,upload} from '../middlewares/middlewareJunctions.js'

const router=Router();
router.use(userAuthenticate);
router.route('/')
.get(getAllVideos)
.post(upload.fields([
    {
        name:'video',
        maxCount:1
    },
    {
        name:'thumbnail',
        maxCount:1
    }
]),publishAVideo)

router.route('/:videoId')
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.fields(
    [
        {
            name:'video',
            maxCount:1
        },
        {
            name:'thumbnail',
            maxCount:1
        }
    ]
),updateVideo)

router.route('/toggle/publish/:videoId').patch(togglePublishStatus)

export default router;