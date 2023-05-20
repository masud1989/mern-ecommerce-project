const DataModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const createToken = require('../utils/createToken');
// const {validateMongoDBId} = require('../utils/validateMongoDBId');


// User Create 
exports.createUser = asyncHandler(async (req, res) => {
  const reqBody = req.body;
  const email = reqBody.email;
  const ExistingUser = await DataModel.findOne({ email: email });

  if (!ExistingUser) {
    const NewUser = await DataModel.create(reqBody);
    res.status(200).json({ status: "success", data: NewUser });
  } else {
    res.status(400).json({ status: "fail", message: "Email already exists" });
  }
});

// User Login
exports.login = asyncHandler(async(req, res) => {
  const {email, password} = req.body;
  const findUser = await DataModel.findOne({email});
  const passwordMatched = await findUser.isPasswordMatched(password)
  
  if (findUser && passwordMatched) {
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

// Get all Users
exports.getAllUsers =asyncHandler( async (req, res) => {
  try {
    const data = await DataModel.find();
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
    const data = await DataModel.findById(id)
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
    const deleteData = await DataModel.findByIdAndDelete(id)
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
    const updatedData = await DataModel.findByIdAndUpdate(id, Data)
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
    const blockUser = await DataModel.findByIdAndUpdate(id, Data)
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
  const unBlockUser = await DataModel.findByIdAndUpdate(id, Data)
    res.status(200).json({ status: "success", message:"User Unblocked Success", data: Data});
  } catch (error) {
    res.status(400).json({ status: "fail", message:"User Unblocked Fail", data: error});
  }
})