import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

//__________ Database Code
const mongoUrl =
	process.env.MONGO_URL ||
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.qxpka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Promise = Promise

module.exports.User = require('./user')
