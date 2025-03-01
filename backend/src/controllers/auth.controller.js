import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { validateInputs } from "../lib/validateInputs.js";


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

export const signin = (req, res) => {
    res.send("signin route");
};

export const logout = (req, res) => {
    res.send("logout route");
};