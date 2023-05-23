const express = require('express');
const router = express.Router();
const {createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unBlockUser, makeAdmin, makeUser, handleRefreshToken, logout} = require('../controllers/userController');
const { createProduct, getProduct, getAllProducts } = require('../controllers/productController');
const {AuthMiddleware, AdminCheck} = require('../middlewares/AuthMiddleware');

// Auth Routes 
router.post('/createUser', createUser);
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

// Product Route 
router.post('/createProduct', AuthMiddleware, AdminCheck, createProduct)
router.get('/getProduct/:id', getProduct)
router.get('/getAllProducts', getAllProducts)


module.exports = router;