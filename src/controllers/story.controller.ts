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

        this.router.get('/my',
            acl.allow('user', [{
                role: 'user',
                predicate: async req => isMyRequest(req)
            }]),
            this.getStory
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

    public getStory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            validationResult(req).throw()
            const userId = req?.user
            const page = req.query.page ? Number(req.query.page) : 1
            const limit = req.query.limit ? Number(req.query.limit) : 30
            const result = await StoryService.getStory(Story, userId, page, limit, req.parsedData)
            res.json(result)
        } catch (err) {
            next(err)
        }
    }
}

