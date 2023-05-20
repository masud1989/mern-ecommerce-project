const express = require('express');
const router = express.Router();
const {createUser, login, getAllUsers, getUser, deleteUser, updateUser} = require('../controllers/userController');
const {AuthMiddleware, AdminCheck} = require('../middlewares/AuthMiddleware');

router.post('/createUser', createUser);
router.post('/login', login);
router.get('/getAllUsers', AuthMiddleware, getAllUsers);
router.get('/getUser/:id', AuthMiddleware, AdminCheck, getUser);
router.get('/deleteUser/:id', AuthMiddleware, AdminCheck,  deleteUser);
router.post('/updateUser/:id', AuthMiddleware, AdminCheck, updateUser);


module.exports = router;