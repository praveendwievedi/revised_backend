import { Router } from "express";
const router =Router();
import {userAuthenticate} from '../middlewares/middlewareJunctions.js'
import {getUserTweets,
    createTweet,
    updateTweet,
    deleteTweet
} from '../controller/tweet.controller.js'

router.use(userAuthenticate)
router.route('/')
.post(createTweet)
.get(getUserTweets)

router.route('/:tweetId')
.patch(updateTweet)
.delete(deleteTweet)

export default Router;