const express = require('express');
const router = express.Router();
const {createUser, login, getAllUsers, getUser, deleteUser, updateUser, blockUser, unBlockUser} = require('../controllers/userController');
const {AuthMiddleware, AdminCheck} = require('../middlewares/AuthMiddleware');

router.post('/createUser', createUser);
router.post('/login', login);
router.get('/getAllUsers', AuthMiddleware, getAllUsers);
router.get('/getUser/:id', AuthMiddleware, AdminCheck, getUser);
router.get('/deleteUser/:id', AuthMiddleware, AdminCheck,  deleteUser);
router.post('/updateUser/:id', AuthMiddleware, AdminCheck, updateUser);
router.post('/blockUser/:id', AuthMiddleware, AdminCheck, blockUser);
router.post('/unBlockUser/:id', AuthMiddleware, AdminCheck, unBlockUser);


module.exports = router;