import { body } from "express-validator";

export const registerValidation = [
  body('name').isLength({ min: 0 }),
  body('surename').isLength({ min: 0 }),
  body('patronymic').isLength({ min: 0 }),
  body('phone').isLength({ min: 0 }),
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен состоять от 6').isLength({ min: 6 }),
]