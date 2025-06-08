const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError")
const verifyJWT =asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        console.log(token);
        
        if(!token){
            throw new ApiError(401,"Unauthorize request")
        }

        const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decodedToken);
        

        const user = await User.findById(decodedToken?.id).select("-password")

        if(!user){
            throw new ApiError(401,"Invalid access token")
        }

        req.user=user;

        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})

module.exports = verifyJWT;
