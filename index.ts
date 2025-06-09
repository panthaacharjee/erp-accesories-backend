const server  = require("./app.ts")
const dotenv = require("dotenv")
const conncetDB = require("./src/config/Datebase.ts")
const cloudinary = require("cloudinary");

dotenv.config({path:"./src/config/config.env"})

conncetDB()

//Cloudinary
  cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


server.listen(process.env.PORT,()=>console.log(`Server is working on http://localhost:${process.env.PORT}`))



