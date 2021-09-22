import app from './app'
import config from './config'
import logger from './utils/logger'

app.listen(config.port, () => {
    logger.info(`Server worker with pid ${process.pid} is now running on port ${config.port} in ${config.env}`)
})