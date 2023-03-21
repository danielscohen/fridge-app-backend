const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllProductsAllUsers = async (req, res) => {
    const products = await Product.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getProduct = async (req, res) => {
    const {
        params: { id: productId },
    } = req

    const product = await Product.findOne({
        _id: productId,
    })
    if (!product) {
        throw new NotFoundError(`No product with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({ product })
}



const deleteProduct = async (req, res) => {
    const {
        params: { id: productId },
    } = req

    const product = await Product.findByIdAndRemove({
        _id: productId,
    })
    if (!product) {
        throw new NotFoundError(`No product with id ${productId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    deleteProduct,
    getProduct,
    getAllProductsAllUsers
}