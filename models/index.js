import dotenv from "dotenv"
import mongoose from 'mongoose'

// This file is opened when you are importing a whole folder like this './models' 
// Here all connection to the db magic happens

dotenv.config()

const mongoUrl =
	process.env.MONGO_URL ||
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.qxpka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = Promise


// including models from the external files - this makes it easier to add/delete/update model if it is needed
module.exports.User = require('./user')
