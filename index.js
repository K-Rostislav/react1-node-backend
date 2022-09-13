import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as ProductController from "./controllers/ProductController.js";

mongoose.connect(process.env.MONGODB_URI)
.then(() => {console.log('DB OK')})
.catch((error) => {console.log('DB error', error)})

const app = express()

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))

app.get('/products', ProductController.getProducts)
app.get('/products/:id', ProductController.getOneProduct)
app.get('/me', checkAuth, UserController.getMe)
app.post('/login', UserController.login)
app.post('/register', registerValidation, UserController.register)

app.listen(process.env.PORT || 8000, (error) => {
  if (error) return console.log(error)

  console.log('Server OK')
})