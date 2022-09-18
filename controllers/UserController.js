import UserModel from "../models/User.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)

    if (!user) {
    return res.status(404).json({
        message: 'Пользователь не найден'
    })
    }

    const {password, ...userData} = user._doc

    res.json({...userData})
  } catch (error) {
    return res.status(401).json({
    message: 'Нет доступа'
    })
  }
}

export const editData = async (req, res) => {
  try {
    let doc = await UserModel.findOneAndUpdate(
      {
        _id: req.body._id
      },
      {
        name: req.body.name,
        surename: req.body.surename,
        patronymic: req.body.patronymic,
        phone: req.body.phone,
        email: req.body.email,
      },
      {
        new: true
      },
    )

   res.json(doc)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось изменить данные пользователя'
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ phone: req.body.phone })

    if(!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)

    if(!isValidPass) {
      return res.status(401).json({
        message: 'Неверный номер или пароль'
      })
    }

    const token = jwt.sign({
      id: user._id
    },
    'secret',
    {
      expiresIn: '30d'
    })

    const {password, ...userData} = user._doc

    res.json({
      ...userData,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось авторизоваться'
    })
  }
}

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json(errors.array())

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.body.password, salt)

    const doc = new UserModel({
      name: req.body.name,
      surename: req.body.surename,
      patronymic: req.body.patronymic,
      phone: req.body.phone,
      email: req.body.email,
      password: passwordHash
    })

    const uniqEmail = await UserModel.findOne({email: req.body.email})
    const uniqPhone = await UserModel.findOne({email: req.body.phone})

    if (uniqEmail) {
      return res.status(500).json({
        message: 'Не удалось зарегистрироваться'
      })
    }
    if (uniqPhone) {
      return res.status(500).json({
        message: 'Не удалось зарегистрироваться'
      })
    }

    const user = await doc.save()

    const token = jwt.sign({
      id: user._id
    },
    'secret',
    {
      expiresIn: '30d'
    })

    const {password, ...userData} = user._doc

    res.json({
      ...userData,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться'
    })
  }
}
