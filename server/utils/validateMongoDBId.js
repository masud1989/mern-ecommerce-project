const  mongoose = require("mongoose");

const validateMongoDBId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid){
        throw new Error('This id is invalid or not found')
    }
}

mongoose.exports = validateMongoDBId;