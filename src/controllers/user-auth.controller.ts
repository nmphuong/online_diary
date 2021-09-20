import * as acl from '../middlewares/access-control'
import * as validation from '../middlewares/validations'
import { Router, Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model'
import * as AuthService from '../services/auth.service'
import { validationResult } from 'express-validator'

export default class UserAuthController {
    public router: Router

    constructor () {
        this.router = Router()
        this.routes()
    }

    private routes () {
        this.router.post('/register',
            acl.allow('guest'),
            validation.checkAuthUserRegister,
            this.register
        )

        this.router.post('/login',
            acl.allow('guest'),
            validation.checkAuthUserLogin,
            this.login
        )
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            validationResult(req).throw()
            const user = new User(req.body)
            const result = await AuthService.register(User, user, req.parsedData)
            res.json(result)
        } catch (err) {
            next(err)
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            validationResult(req).throw()
            const result = await AuthService.login(User, req.body, req.parsedData)
            res.json(result)
        } catch (err) {
            next(err)
        }
    }
}

