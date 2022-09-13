import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret')
      req.userId = decoded.id
      next()
    } catch (error) {
      return res.status(401).json({
        message: 'Нет доступа'
      })
    }
  } else {
    return res.status(401).json({
      message: 'Нет доступа'
    })
  }
}