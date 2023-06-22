const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const createToken = require('../utils/jwtToken');
const generateRefreshToken = require('../utils/refreshToken');
const sendEmail = require('../utils/sendMail');
const crypto = require('crypto');
const uniqid = require('uniqid');
// const {validateMongoDBId} = require('../utils/validateMongoDBId');


// User Create 
exports.createUser = asyncHandler(async (req, res) => {
  const reqBody = req.body;
  const email = reqBody.email;
  const ExistingUser = await User.findOne({ email: email });

  if (!ExistingUser) {
    const NewUser = await User.create(reqBody);
    res.status(200).json({ status: "success", data: NewUser });
  } else {
    res.status(400).json({ status: "fail", message: "Email already exists" });
  }
});

// User Login
exports.login = asyncHandler(async(req, res) => {
  const {email, password} = req.body;
  const findUser = await User.findOne({email});
  const passwordMatched = await findUser.isPasswordMatched(password)
  
  if (findUser && passwordMatched) {
    const refreshToken = await generateRefreshToken(findUser?.id)
    // console.log(refreshToken)
    const  updatedUser = await User.findByIdAndUpdate(findUser.id, {refreshToken: refreshToken}, {new: true});
    res.cookie('refreshToken', refreshToken, {httpOnly:true, maxAge: 72*60*60*1000})
    const  data = {
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: createToken(findUser?._id)
    }
    res.status(200).json({ status: "success", data: data });  
  } 
  else {
    res.status(400).json({ status: "fail", message: "Invalid Credential" });
  }
})
// Admin Login
exports.adminLogin = asyncHandler(async(req, res) => {
  const {email, password} = req.body;
  const adminUser = await User.findOne({email});
  // console.log(adminUser)
  const passwordMatched = await adminUser.isPasswordMatched(password)
  
  if(adminUser.role !== 'admin'){
    res.json({status: 'fail', message:'Not Admin Credentials'})
  }; 
  if (adminUser && passwordMatched) {
    const refreshToken = await generateRefreshToken(adminUser?._id)
    // console.log(refreshToken)
    const  updatedUser = await User.findByIdAndUpdate(adminUser.id, {refreshToken: refreshToken}, {new: true});
    res.cookie('refreshToken', refreshToken, {httpOnly:true, maxAge: 72*60*60*1000})
    const  data = {
      _id: adminUser?._id,
      firstName: adminUser?.firstName,
      lastName: adminUser?.lastName,
      email: adminUser?.email,
      mobile: adminUser?.mobile,
      token: createToken(adminUser?._id)
    }
    res.status(200).json({ status: "success", data: data });  
  } 
  else {
    res.status(400).json({ status: "fail", message: "Invalid Credential" });
  }
})

// Handle Refresh Token 
exports.handleRefreshToken = asyncHandler( async(req, res) => {
  const cookie = req.cookies;
  // console.log(cookie)
  if(!cookie?.refreshToken) {
    throw new ("No Refresh Token in Cookie")
  }
  const refreshToken = cookie.refreshToken;
  // console.log(refreshToken)
  const user = await User.findOne({refreshToken})
  if(!user){
    throw new ("No Refresh Token Present in DB or not matched")
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
    if(user.id !== decoded?.id){
      throw new ("Something Wrong Refresh Token ")
    }
    const accessToken = generateRefreshToken(user.id)
    res.json({accessToken})
  }) 
})

// Logout Functionality 
exports.logout = asyncHandler( async(req, res) => {
  const cookie = req.cookies;
  if(!cookie?.refreshToken){
    throw new Error("No Refresh Token in Cookies")
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.find({refreshToken});
  if(!user){
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
    return res.sendStatus(204)
  }
  await User.findOneAndUpdate({
     refreshToken: "",
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  })
  return res.sendStatus(204)
})


// Get all Users
exports.getAllUsers =asyncHandler( async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({ status: "success", total:data.length, data: data  });
  } catch (error) {
    res.status(400).json({ status: "fail", message: "Sorry! Error Ocurred" });
  }
})

// Get single User
exports.getUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  // validateMongoDBId(id)
  try {
    const data = await User.findById(id)
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error  });
  }
})

//Delete User
exports.deleteUser = asyncHandler(async (req, res) => {
  let {id} = req.params;
  // validateMongoDBId(id)
  try {
    const deleteData = await User.findByIdAndDelete(id)
    res.status(200).json({ status: "success", data: deleteData });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error  });
  }
})

//Update User
exports.updateUser = asyncHandler(async (req, res) => {
  let {id} = req.params;
  // validateMongoDBId(id)
  let reqBody = req.body;
  let Data = {
    id,
    firstName: reqBody?.firstName,
    lastName: reqBody?.lastName,
    email: reqBody?.email,
    mobile: reqBody?.mobile,}
  try {
    const updatedData = await User.findByIdAndUpdate(id, Data)
    res.status(200).json({ status: "success", data: Data});
  } catch (error) {
    res.status(400).json({ status: "fail", data: error  });
  }
})

// Block an User
exports.blockUser = asyncHandler(async(req, res) => {
  const {id} = req.params;
  // validateMongoDBId(id)
  let Data = {
    id,
    isBlocked:true
  }
  try {
    const blockUser = await User.findByIdAndUpdate(id, Data)
    res.status(200).json({ status: "success", message:"User Blocked Success", data: Data});
  } catch (error) {
    res.status(400).json({ status: "fail", message:"User Blocked Fail", data: error});
  }
})

// Unblock an User
exports.unBlockUser = asyncHandler(async(req, res) => {
  const {id} = req.params;
  // validateMongoDBId(id)
  let Data = {
    id,
    isBlocked:false
  }
  try {
  const unBlockUser = await User.findByIdAndUpdate(id, Data)
    res.status(200).json({ status: "success", message:"User Unblocked Success", data: Data});
  } catch (error) {
    res.status(400).json({ status: "fail", message:"User Unblocked Fail", data: error});
  }
})

// Make an user to admin 
exports.makeAdmin = asyncHandler(async(req, res) => {
  const {id} = req.params;
  // validateMongoDBId(id)
  let Data = {
    id,
    role:"admin"
  }
  try {
  const admin = await User.findByIdAndUpdate(id, Data)
    res.status(200).json({ status: "success", message:"Admin made Success", data: Data});
  } catch (error) {
    res.status(400).json({ status: "fail", message:"Admin made Fail", data: error});
  }
})
// Make admin to user 
exports.makeUser = asyncHandler(async(req, res) => {
  const {id} = req.params;
  // validateMongoDBId(id)
  let Data = {
    id,
    role:"user"
  }
  try {
  const admin = await User.findByIdAndUpdate(id, Data)
    res.status(200).json({ status: "success", message:"User made Success", data: Data});
  } catch (error) {
    res.status(400).json({ status: "fail", message:"User made Fail", data: error});
  }
})

// Update Password 
exports.updatePassword = asyncHandler( async(req, res) => {
  const {id} = req.user;
  const {password} = req.body;
  const user = await User.findById(id);

  if(password){
    user.password = password;
    const updatedPassword = await user.save()
    res.json(updatedPassword)
  }else{
    res.json(user)
  }
})

//Forgot Password Token
exports.forgotPasswordToken = asyncHandler(async(req, res) => {
  const {email} = req.body;
  // console.log(email)
  const user = await User.findOne({email});
  console.log(user)
  if(!user) throw new Error('User is not found with this email');


  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please click the link to reset your password <a href='http://localhost:5000/api/v1/resetPassword/${token}'>Click Here</a>`
    const data = {
      to:email,
      text:"Hey! User",
      subject:"Forgot Password Link",
      htm:resetURL,
    }
    sendEmail(data)
    res.json(token)
    // console.log(token)

  } catch (error) {
    throw new Error (error)
  }
})

//Reset Password
exports.resetPassword = asyncHandler( async(req, res) => {
  const {password} = req.body;
  const {token} = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("Hello"+ " " +parseInt(hashedToken))
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}
  })
  console.log(user)

  if(!user) throw new Error('Token Expired, Try again Later')
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)
})

// Get WishList 
exports.getWishList = asyncHandler( async(req, res) => {
  const {_id} = req.user;
  try {
    const findUser = await User.findById(_id).populate('wishList');
    res.json({status: 'success', data: findUser})
  } catch (error) {
    // res.json({status: 'fail', error: error})
    throw new Error(error)
  }
});

// Save Address
exports.saveAddress = asyncHandler( async(req, res, next) => {
  const id = req.user.id;
  const postBody = req.body;
  try {
    const updateUserAddress = await User.findByIdAndUpdate(id, { address: postBody?.address})
  res.json(updateUserAddress).populate('address')
  } catch (error) {
    throw new Error(error) 
  }
});

//Add to Cart
exports.userCart =  asyncHandler( async(req, res) => {
 const  {cart} = req.body;
//  console.log(cart)
 const {id} = req.user;
//  console.log(id)

try {
  let products = [];
  const user = await User.findById(id);
  
  const alreadyExistCart = await Cart.findOne({ orderby: user.id});
  
  if(alreadyExistCart){
    alreadyExistCart.remove();
  }

  for (let i = 0; i < cart?.length; i++) {
    let cartObject = {};
    cartObject.product = cart[i].id;
    cartObject.count = cart[i].count;
    cartObject.color = cart[i].color;
    let getPrice = await Product.findById(cart[i].id).select("price").exec();
    // console.log(getPrice)
    cartObject.price = getPrice.price;

    products.push(cartObject)
    console.log(products)
  };

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    let price
    cartTotal = cartTotal + products[i].price * products[i].count; 
  }
  console.log(cartTotal)



  let newCart = await new Cart({
    products,
    cartTotal,
    orderby: user?.id
  }).save();
 
  res.json(newCart)

} catch (error) {
  throw new Error(error)
}

})

//User Cart

