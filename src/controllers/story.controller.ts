import * as acl from '../middlewares/access-control'
import { Router, Request, Response, NextFunction } from 'express'
import { Story } from '../models/story.model'
import * as StoryService from '../services/story.service'
import { validationResult } from 'express-validator'
import { isMyRequest } from '../middlewares/auth-control'

export default class StoryController {
    public router: Router

    constructor () {
        this.router = Router()
        this.routes()
    }

    private routes () {
        this.router.post('/create',
            acl.allow('user', [{
                role: 'user',
                predicate: async req => isMyRequest(req)
            }]),
            this.create
        )
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            validationResult(req).throw()
            const story = new Story(req.body)
            const userId = req?.user
            const result = await StoryService.create(Story, story, userId, req.parsedData)
            res.json(result)
        } catch (err) {
            next(err)
        }
    }
}

