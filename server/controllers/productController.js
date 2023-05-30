const ProductModel = require('../models/productModel');
// const ProductModel = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const ListService = require('../services/listService');
const Product = require('../models/productModel');
const User = require('../models/userModel');
// const { get } = require('mongoose');

exports.createProduct = asyncHandler( async(req, res) => {
    const reqBody = req.body;
    try {
        const product = await Product.create(reqBody)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }   
});

exports.getProduct = asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const findProduct = await Product.findById(id)
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
        let query = Product.find(JSON.parse(queryStr))
       
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
            const productCount = await Product.countDocuments();
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
        const allProducts = await Product.find()
        res.status(200).json({ status: "success", total:allProducts.length, data: allProducts  });
    } catch (error) {
        throw new Error(error)
    }   
});

exports.updateProduct =  asyncHandler( async(req, res) => {
    const id = req.params.id;
    const PostBody = req.body;
    try {
        const updateProduct = await Product.updateOne({_id:id}, PostBody)
        res.status(200).json({status: 'success', data: updateProduct})
    } catch (error) {
        throw new Error(error)
    } 
});

exports.deleteProduct =  asyncHandler( async(req, res) => {
    const id = req.params.id;
    try {
        const deletedData = await Product.findByIdAndDelete(id)
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
};

exports.addToWishlist = asyncHandler( async(req, res) => {
    const {_id }= req.user;
    const {productId} = req.body;

    try {
        const user = await User.findById({_id});
        // console.log(user)
        const alreadyAdded = user.wishList.find( (id) => id.toString() === productId);
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {$pull: {wishList: productId}});
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id, {$push: {wishList: productId}});
            res.json(user); 
        }
    } catch (error) {
        throw new Error(error)
    }
});

exports.rating = asyncHandler ( async(req, res) => {
    const {_id} = req.user;
    const {star, productId} = req.body;
    try {
        const product = await Product.findById(productId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedBy.toString() === _id.toString()
        );

        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star},
                },
                {
                    new: true,
                }
            );
            
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                productId, 
                {
                    $push: {
                        ratings: {
                            star: star, 
                            postedBy: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
            
        }
        const getAllRatings = await Product.findById(productId);
        let totalRating = getAllRatings.ratings.length;
        let sumOfRating = getAllRatings.ratings
            .map((item)=>item.star)
            .reduce( (prev, curr) => prev + curr, 0);
            let actualRating = Math.round(sumOfRating / totalRating)
            let finalProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    totalRating: actualRating,
                },
                {
                    new: true
                }
            );
            res.json(finalProduct)

    } catch (error) {
        throw new Error(error)
    }
});

