const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');

exports.createBrand = asyncHandler( async(req, res) => {
    try {
        const postBody = req.body;
        const newBrand = await Brand.create(postBody);
        res.json({status: 'success', data:newBrand});
    } catch (error) {
        throw new Error()
    }
});

exports.updateBrand = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const postBody = req.body;
        const updateBrand = await Brand.findByIdAndUpdate(id, postBody);
        res.json({status: 'success', data:updateBrand});
    } catch (error) {
        throw new Error()
    }
});

exports.deleteBrand = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json({status: 'success', data:deleteBrand});
    } catch (error) {
        throw new Error()
    }
});

exports.getBrand = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const getBrand = await Brand.findById(id);
        res.json({status: 'success', data:getBrand});
    } catch (error) {
        throw new Error()
    }
});

exports.getAllBrand = asyncHandler( async(req, res) => {
    try {
        const getBrands = await Brand.find();
        res.json({status: 'success', total:getBrands.length, data:getBrands});
    } catch (error) {
        throw new Error()
    }
});
