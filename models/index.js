import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

//__________ Database Code
const mongoUrl =
	process.env.MONGO_URL ||
	'mongodb+srv://andreao:SLXqQJV5LDq3OW9w@cluster0.z2q0p.mongodb.net/enBostad?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })

mongoose.Promise = Promise

module.exports.User = require('./user')
