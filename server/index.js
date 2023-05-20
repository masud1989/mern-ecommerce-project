const app = require('./app');
const PORT = process.env.PORT || 4000;

// app.use('/', (req, res) => {
//     res.send("Hello! from Server")
// })

app.listen(PORT, ()=>{
    console.log(`Server is running on port no: ${PORT}`)
})