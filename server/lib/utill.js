import jwt from 'jsonwebtoken';

// Function to Generate a token for a User 

export const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET);
    return token;
}