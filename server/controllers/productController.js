const ProductModel = require('../models/productModel');
// const ProductModel = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ListService = require('../services/listService');

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

exports.updateProduct =  asyncHandler( async(req, res) => {
    const id = req.params.id;
    const PostBody = req.body;
    try {
        const updateProduct = await ProductModel.updateOne({_id:id}, PostBody)
        res.status(200).json({status: 'success', data: updateProduct})
    } catch (error) {
        throw new Error(error)
    } 
});

exports.deleteProduct =  asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const deletedData = await ProductModel.findByIdAndDelete(id)
        res.status(200).json({status: 'success', data: deletedData})
    } catch (error) {
        throw new Error(error)
    } 
});

exports.productList = async (req, res) => {
    let SearchRgx = {"$regex":req.params.searchKeyword, "$options": "i"}
    let SearchArray = [{Name:SearchRgx}]
    let Result = await ListService(req, ProductModel, SearchArray)
    res.status(200).json(Result)
}

