const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URL)
        console.log('DB Connected Successful')
    } catch (error) {
        console.log('Database Error')
    } 
}
module.exports = dbConnect;