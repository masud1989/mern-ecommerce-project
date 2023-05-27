const ProductModel = require('../models/productModel');
// const ProductModel = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ListService = require('../services/listService');
const productModel = require('../models/productModel');
const { get } = require('mongoose');

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

exports.getProductsByFilter = asyncHandler( async(req, res) => {
    try {
        // Filtering 
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach( (el) => delete queryObj[el])
        console.log(queryObj)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = productModel.find(JSON.parse(queryStr))
       
        // Sorting 
         if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
         }else{
            query = query.sort("-createdAt")
         }

        //  Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        } else {
            query = query.select(" ")
        }

        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const productCount = await productModel.countDocuments();
            if(skip >= productCount) throw new Error ('This Page does not exist')
        }
        // console.log(page, limit, skip)

        const products = await query
        res.json(products) 
    } catch (error) {
        throw new Error(error)
    }   
});
exports.allProducts = asyncHandler( async(req, res) => {
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

