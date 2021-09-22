import * as winston from 'winston'

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    exitOnError: false,
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log',
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: './logs/combined.log',
            handleExceptions: true,
            maxsize: 5242880,
            maxFiles: 5,
            format: winston.format.simple()
        })
    ]
})


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        handleExceptions: true,
        format: winston.format.simple()
    }))
}

export default logger