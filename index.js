import env from 'dotenv'
import Koa from 'koa'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'

import { database } from './config/index.js'
import initRoutes from './routes/index.js'

const app = new Koa()
const port = process.env.PORT || 5000

app.context.user = ''

// Init ENV
env.config()

// JSON middleware
app.use(json())

// Body parser middleware
app.use(bodyparser())

// Connect database
database()

// Init routes
initRoutes(app)

app.listen(port, () => console.log(`Server started at port ${port}`))
