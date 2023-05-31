const express = require('express');
const router = express.Router();

const {AuthMiddleware, AdminCheck} = require('../middlewares/AuthMiddleware');
const { createProductCategory, updateProductCategory, deleteProductCategory, getProductCategory, getAllProductCategory } = require('../controllers/productCategoryController');
const {createUser, login, getAllUsers, getUser, deleteUser, updateUser, updatePassword, blockUser, unBlockUser, makeAdmin, makeUser, handleRefreshToken, logout, forgotPasswordToken, resetPassword} = require('../controllers/userController');
const { createProduct, getProduct, allProducts, getProductsByFilter, updateProduct, deleteProduct, productList, addToWishlist, rating } = require('../controllers/productController');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog } = require('../controllers/blogController');
const { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategory } = require('../controllers/blogCategoryController');
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require('../controllers/brandController');
const { createCoupon, updateCoupon, deleteCoupon, getAllCoupons } = require('../controllers/couponController');


// Auth Routes 
router.post('/createUser', createUser);
router.post('/forgotPasswordToken', forgotPasswordToken)
router.put('/resetPassword/:token', resetPassword)
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
router.post('/addToWishlist', AuthMiddleware, addToWishlist );
router.post('/rating', AuthMiddleware, rating);

// Blog Routes 
router.post('/createBlog', AuthMiddleware, AdminCheck, createBlog);
router.post('/updateBlog/:id', AuthMiddleware, AdminCheck, updateBlog);
router.get('/deleteBlog/:id', AuthMiddleware, AdminCheck, deleteBlog);
router.post('/getBlog/:id', getBlog);
router.get('/getAllBlogs', getAllBlogs);
router.post('/likeBlog', AuthMiddleware, likeBlog);
router.post('/disLikeBlog', AuthMiddleware, disLikeBlog);

//Product Category Routes
router.post('/createProductCategory', AuthMiddleware, AdminCheck, createProductCategory);
router.post('/updateProductCategory/:id', AuthMiddleware, AdminCheck, updateProductCategory);
router.get('/deleteProductCategory/:id', AuthMiddleware, AdminCheck, deleteProductCategory);
router.get('/getProductCategory/:id', AuthMiddleware, AdminCheck, getProductCategory);
router.get('/getAllProductCategory', AuthMiddleware, AdminCheck, getAllProductCategory);

//Blog Category Routes
router.post('/createBlogCategory', AuthMiddleware, AdminCheck, createBlogCategory);
router.post('/updateBlogCategory/:id', AuthMiddleware, AdminCheck, updateBlogCategory);
router.get('/deleteBlogCategory/:id', AuthMiddleware, AdminCheck, deleteBlogCategory);
router.get('/getBlogCategory/:id', AuthMiddleware, AdminCheck, getBlogCategory);
router.get('/getAllBlogCategory', AuthMiddleware, AdminCheck, getAllBlogCategory);

//Brand Routes
router.post('/createBrand', AuthMiddleware, AdminCheck, createBrand);
router.post('/updateBrand/:id', AuthMiddleware, AdminCheck, updateBrand);
router.get('/deleteBrand/:id', AuthMiddleware, AdminCheck, deleteBrand);
router.get('/getBrand/:id', AuthMiddleware, AdminCheck, getBrand);
router.get('/getAllBrand', AuthMiddleware, AdminCheck, getAllBrand);

//Coupon Routes
router.post('/createCoupon', AuthMiddleware, AdminCheck, createCoupon);
router.post('/updateCoupon/:id', AuthMiddleware, AdminCheck, updateCoupon);
router.post('/deleteCoupon/:id', AuthMiddleware, AdminCheck, deleteCoupon);
router.get('/getAllCoupons', AuthMiddleware, AdminCheck, getAllCoupons);



module.exports = router;