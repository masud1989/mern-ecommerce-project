const Category = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');

exports.createProductCategory = asyncHandler( async(req, res) => {
    try {
        const postBody = req.body;
        const newCategory = await Category.create(postBody);
        res.json({status: 'success', data:newCategory});
    } catch (error) {
        throw new Error()
    }
});

exports.updateProductCategory = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const postBody = req.body;
        const updateCategory = await Category.findByIdAndUpdate(id, postBody);
        res.json({status: 'success', data:updateCategory});
    } catch (error) {
        throw new Error()
    }
});

exports.deleteProductCategory = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json({status: 'success', data:deleteCategory});
    } catch (error) {
        throw new Error()
    }
});

exports.getProductCategory = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const getCategory = await Category.findById(id);
        res.json({status: 'success', data:getCategory});
    } catch (error) {
        throw new Error()
    }
});

exports.getAllProductCategory = asyncHandler( async(req, res) => {
    try {
        const getCategories = await Category.find();
        res.json({status: 'success', total:getCategories.length, data:getCategories});
    } catch (error) {
        throw new Error()
    }
});
