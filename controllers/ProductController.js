import ProductModel from "../models/Product.js";


export const getProducts = async (req, res) => {
  try {
    const { search, orderBy } = req.query
    const regexp = new RegExp(`${search}`, 'i')

    const products = search ? 
    await ProductModel.find({ $text : { $search: regexp } }, { score: {$meta: "textScore"} } ).sort({ score: {$meta: "textScore"}}) :
    await ProductModel.find().sort({ price: orderBy })

    res.json(products)
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось загрузить товар'
    })
  }
}

export const getOneProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id)
    res.json(product)
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось загрузить товар'
    })
  }
}