import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { validateInputs } from "../lib/validateInputs.js";
import cloudinary from "../lib/cloudinary.js";

export const validateSignup = validateInputs(["fullname", "email", "password"]);


export const signup = async (req, res) => {
    const { email, fullname, password } = req.body;
   try {
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password should be at least 6 characters",
        });
        
    }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        };

        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            email,
            fullname,
            password: hashedPassword,
        });
        
        if(newUser) {
           generateToken(newUser._id, res)
           res.status(201).json({
           _id: newUser._id,
           fullname: newUser.fullname,
           email: newUser.email,
           proflePics: newUser.profilePics || "",    
        });
        } else {
            return res.status(400).json({
                message: "User not created",
            });
        }

   } catch (error) {
    console.log("Error in signup controller",error.message);
    res.status(500).json({
        message: "internal server error",
    })
   }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            })          
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            })
        } else {
            generateToken(user._id, res)
            res.status(200).json({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                proflePics: user.profilePics || "",    
            });
        }
    } catch (error) {
        console.log("Error in signin controller",error.message);
        res.status(500).json({
            message: "internal server error",
        })
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            });
        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({
            message: "internal server error",
        })
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePics} = req.body;
        const userId = req.user._id;

        if(!profilePics) {
            return res.status(400).json({
                message: "Profile picture is required",
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePics, {
            upload_preset: "profilePics",
        });

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePics: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) { 
        console.log("Error in updateProfile controller",error.message);
        res.status(500).json({
            message: "internal server error",
        });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error when we are in checkAuth controller",error.message);
        res.status(500).json({
            message: "internal server error",
        });
    }
};