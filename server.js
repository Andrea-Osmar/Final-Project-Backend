import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import listEndpoints from 'express-list-endpoints'
import db from './models' 
import bent from 'bent'

import { authenticateUser, checkConnection } from './middlewares/middlewares' 

//__________ Server
const port = process.env.PORT || 8080
const app = express()

//__________ Middlewares
app.use(cors())
app.use(bodyParser.json())

//__________ Root endpoint
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//__________Create user
app.post('/users', async (req, res) => {
  try {
    const { username, password, email } = req.body
    const salt = bcrypt.genSaltSync()
    const user = await new db.User({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
    }).save()

    res.status(201).json({ userId: user._id, accessToken: user.accessToken })
  } catch (err) {
    res.status(400).json({ message: 'could not create this user', errors: err })
  }
})

//__________Login session
app.post('/sessions', async (req, res) => {
  try {
    const user = await db.User.findOne({ email: req.body.email }) 
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.status(200).json({
        userFound: true,
        userId: user._id,
        accessToken: user.accessToken,
      })
    } else {
      res.status(400)
      res.json({
        userFound: false,
        message: 'Login failed, please try again.',
      })
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Login failed, please try again.', errors: err })
  }
})

  //__________ Endpoint with all data
  app.get('/list', async (req, res) => {
    const getJSON = bent('json')
    const object = await getJSON(
      'https://bostad.stockholm.se/Lista/AllaAnnonser'
    )
    res.status(200).json(object)
  })

//__________ Endpoint to save specific ad
app.post('/saveData', checkConnection, authenticateUser, async (req, res) => {
  const { annonsId } = req.body
  const user = await db.User.findById(req.user._id)
  if (user) {
    user.savedApartments.addToSet(annonsId)
    user.save()
    res.status(201).json(user.savedApartments)
  } else {
    res.status(404).json({
      message: 'user not found', error: err.errors})
  }
})

//__________ Endpoint to list users saved ads
app.get('/getData', authenticateUser)
app.get('/getData', async (req, res) => {
  try {
    //Success
    const user = await db.User.findById(req.user._id)
    res.status(200).json(user.savedApartments) 
  } catch (err) {
    res.status(400).json({ message: 'Could not get item', error: err.errors })
  }
})

//__________ Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})