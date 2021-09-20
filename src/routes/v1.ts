import * as express from 'express'

import UserAuthController from '../controllers/user-auth.controller'

class Routes {
    router: express.Router

    constructor () {
        this.router = express.Router()

        this.router.use('/user', new UserAuthController().router)
    }
}

export default new Routes().router