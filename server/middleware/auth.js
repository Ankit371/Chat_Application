

// middleware to protect routes 

import User from "../models/User.js";
import jwt from "jsonwebtoken"

export const protectRoute = async (req , res , next )=>{
        try {
            const token = req.headers.token;


            const decoded = jwt.verify(token , process.env.JWT_SECRET)


            const user = await User.findById(decoded.userId).select("-password")

            if(!user) return res.json({success:false, message:"user not found "})

                req.user = user;
                next();

        } catch (error) {
            console.log(error.message)
            res.json({success:false, message:error.message})
        }
}








// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// export const protectRoute = async (req, res, next) => {
//   try {
//     // header से token निकाला
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1]; // "Bearer <token>" से सिर्फ token

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // DB से user find करो (password हटाकर)
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     req.user = user; // ✅ अब controller में req.user use कर सकता है
//     next();
//   } catch (error) {
//     console.log(error.message);
//     res.status(401).json({ success: false, message: "Not authorized, token failed" });
//   }
// };
