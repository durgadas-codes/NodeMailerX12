import User from "../model/auth.model.js"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const registerUser =async (req, res) => {
    try{
        const {name, email, password, domain, skills} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                message : "Please fill all the fields",
                success : false
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                message : "password sould be atleast 8 characters long",
                success : false
            })
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message : "User already exists",
                success : false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            domain,
            skills
        })
        return res.status(201).json({
            message : "User registered successfully",
            success : true,
            user
        })

    } catch(error){
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error",
            success : false
        })
        
    }
}
export const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({
                message : "Invalid email or password",
                success : false
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid password",
                success : false
            })
        }
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET)
        if(isMatch){
            return res.status(200).json({
                message : "User logged in successfully",
                success : true,
                user,
                token
            })
        }
    } catch(error){
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error",
            success : false
        })
    }

}