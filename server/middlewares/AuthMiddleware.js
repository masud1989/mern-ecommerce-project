const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const DataModel = require('../models/userModel');


const AuthMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    token = req.headers.token
    // console.log(token)
    if(!token){
        res.status(401).json({status: 'Unauthorized Access'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await DataModel.findById(decoded.id)     
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({status: 'Something went wrong'})
    }
})

const AdminCheck = asyncHandler(async (req, res, next) => {
    // console.log(req.user)
    if(req.user.role !== 'admin'){
        res.status(404).json({status: 'You are not Admin user '})
    }
    next();
})

module.exports = {AuthMiddleware, AdminCheck };