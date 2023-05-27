const express = require('express');
const router = express.Router();
const {createUser, login, getAllUsers, getUser, deleteUser, updateUser, updatePassword, blockUser, unBlockUser, makeAdmin, makeUser, handleRefreshToken, logout, forgotPasswordToken} = require('../controllers/userController');
const { createProduct, getProduct, allProducts, getProductsByFilter, updateProduct, deleteProduct, productList } = require('../controllers/productController');
const {AuthMiddleware, AdminCheck} = require('../middlewares/AuthMiddleware');

// Auth Routes 
router.post('/createUser', createUser);
router.post('/forgotPasswordToken', forgotPasswordToken)
router.post('/login', login);
router.get('/logout', logout);
router.get('/refreshToken', handleRefreshToken);
router.get('/getAllUsers', AuthMiddleware, getAllUsers);
router.get('/getUser/:id', AuthMiddleware, AdminCheck, getUser);
router.get('/deleteUser/:id', AuthMiddleware, AdminCheck,  deleteUser);
router.post('/updateUser/:id', AuthMiddleware, AdminCheck, updateUser);
router.post('/blockUser/:id', AuthMiddleware, AdminCheck, blockUser);
router.post('/unBlockUser/:id', AuthMiddleware, AdminCheck, unBlockUser);
router.post('/makeUser/:id', AuthMiddleware, AdminCheck, makeUser);
router.post('/makeAdmin/:id', AuthMiddleware, AdminCheck, makeAdmin);
router.post('/updatePassword', AuthMiddleware, updatePassword);

// Product Route 
router.post('/createProduct', AuthMiddleware, AdminCheck, createProduct);
router.get('/getProduct/:id', getProduct);
router.get('/getProductsByFilter', getProductsByFilter);
router.get('/allProducts', allProducts);
router.post('/updateProduct/:id', updateProduct);
router.get('/deleteProduct/:id', deleteProduct);
router.get('/productList/:pageNo/:perPage/:searchKeyword', productList);


module.exports = router;