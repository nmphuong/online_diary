import * as express from "express";
import * as cors from 'cors';
import * as helmet from 'helmet'
import config from './config'
import * as JWTLib from './modules/jwt'
import * as DatabaseLib from './modules/db'
import { handlingError } from './middlewares/handling-error'
import v1 from './routes/v1';
import { parseRequestMiddleware } from './middlewares/parse-request'
import { loggerMiddleware } from './middlewares/logger'

class App {
    app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.moduleSetup();
    }

    private config() {
        this.app.use(helmet())
        this.app.use(express.json({ limit: "10mb" }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(parseRequestMiddleware)
        this.app.use(loggerMiddleware())
        this.app.get('/healthcheck', (req, res) => {
            res.sendStatus(200)
        })
        this.app.use('/', v1);
        this.app.use((req, res, next) => {
            const err = new Error('Not Found')
            next(err)
        });
        this.app.use(handlingError)
        this.app.set('trust proxy', true);
        this.handleRuntimeError()
    }

    private handleRuntimeError() {
        process.on('unhandledRejection', (err, p) => {
            const error = err instanceof Error ? {
                errName: err.name,
                errMessage: err.message,
                ...(err.stack && { errStack: err.stack })
            } : err
            console.error(`Unhandled Rejection at: Promise ${JSON.stringify(p)}, reason: ${JSON.stringify(error)}`)
        })

        process.on('uncaughtExeption', (err, p) => {
            const error = err instanceof Error ? {
                errName: err.name,
                errMessage: err.message,
                ...(err.stack && { errStack: err.stack })
            } : err
            console.error(`uncaught Exeption at: Promise ${JSON.stringify(p)}, reason: ${JSON.stringify(error)}`)
        })
    }

    private moduleSetup() {
        DatabaseLib.configure(config.databaseConfig)
        DatabaseLib.initDb()
        JWTLib.configure(config.jwtConfig)
    }
}

export default new App().app;