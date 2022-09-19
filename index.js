import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import UserModel from "./models/User.js";
import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as ProductController from "./controllers/ProductController.js";

mongoose.connect(process.env.MONGODB || 'mongodb+srv://user1:poipop2popkin@cluster0.kbhfg9g.mongodb.net/react1?retryWrites=true&w=majority')
.then(() => {console.log('DB OK')})
.catch((error) => {console.log('DB error', error)})

const app = express()

// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (__, file, cb) => {
//     cb(null, file.originalname)
//   },
// })

// const upload = multer({ storage })

app.use(express.json())
// app.use('/uploads', express.static('uploads'))
app.use(cors())

app.get('/products', ProductController.getProducts)
app.get('/products/:id', ProductController.getOneProduct)
app.get('/me', checkAuth, UserController.getMe)
app.patch('/me/edit', checkAuth, UserController.editData)
app.post('/login', UserController.login)
app.post('/register', registerValidation, UserController.register)

app.post('/profile/upload', checkAuth, async (req, res) => {
  try {
    let doc = await UserModel.findOneAndUpdate(
      {
        _id: req.body._id
      },
      {
        avatarUrl: req.body.image
      },
      {
        new: true
      },
    )
  res.json(doc)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось добавить картинку пользователя'
    })
  }
})

// app.post('/profile/upload', checkAuth, upload.single('image'), (req, res) => {
//   try {
//     UserModel.updateOne({_id: req.body._id}, {$set: {avatarUrl: `/uploads/${req.file.originalname}`}})
//     res.json({
//       url: `/uploads/${req.file.originalname}`
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       message: 'Не удалось добавить картинку пользователя'
//     })
//   }
// })

app.listen(process.env.PORT || 8000, (error) => {
  if (error) return console.log(error)

  console.log('Server OK')
})