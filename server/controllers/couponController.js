const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');


exports.createCoupon = asyncHandler( async (req, res) => {
    try {
        const postBody = req.body;
        const newCoupon = await Coupon.create(postBody);
        res.json({status: 'success', data: newCoupon});
    } catch (error) {
        throw new Error(error)
    }
});

exports.updateCoupon = asyncHandler( async (req, res) => {
    const postBody = req.body;
    const id = req.params.id;
    try {
        const coupon = await Coupon.findByIdAndUpdate(id, postBody);
        res.json({status: 'success', data: coupon});
    } catch (error) {
        throw new Error(error)
    }
});

exports.deleteCoupon = asyncHandler( async (req, res) => {
    const id = req.params.id;
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json({status: 'success', data: deletedCoupon});
    } catch (error) {
        throw new Error(error)
    }
});

exports.getAllCoupons = asyncHandler( async (req, res) => {
    try {
        const allCoupons = await Coupon.find();
        res.json({status: 'success', total:allCoupons.length, data: allCoupons});
    } catch (error) {
        throw new Error(error)
    }
});