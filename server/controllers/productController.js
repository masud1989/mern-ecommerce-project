const ProductModel = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify')

exports.createProduct = asyncHandler( async(req, res) => {
    const reqBody = req.body;
    try {
        const product = await ProductModel.create(reqBody)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }   
});

exports.getProduct = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const findProduct = await ProductModel.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }   
});

exports.getAllProducts = asyncHandler( async(req, res) => {
    try {
        const allProducts = await ProductModel.find()
        res.status(200).json({ status: "success", total:allProducts.length, data: allProducts  });
    } catch (error) {
        throw new Error(error)
    }   
});

