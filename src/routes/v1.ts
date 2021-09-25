import * as express from 'express'
import { verifyJWT } from '../middlewares/verify-jwt'
import UserAuthController from '../controllers/user-auth.controller'
import StoryController from '../controllers/story.controller'

class Routes {
    router: express.Router

    constructor () {
        this.router = express.Router()
        this.router.use([verifyJWT])
        this.router.use('/user', new UserAuthController().router)
        this.router.use('/story', new StoryController().router)
    }
}

export default new Routes().router