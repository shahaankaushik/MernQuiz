import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
import { connectDB } from "../config/db.js";
import User from "../models/userModel.js";

const token_expire_in = "24h";
const jwt_Secret = process.env.JWT_SECRET;


// register
export async function register(req, res) {
  try {
    await connectDB();

    const { name, email, password } = req.body;
    console.log(req.body.name);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required!",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email!",
      });
    }

    const exist = await User.findOne({ email }).lean();
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "user already exists!",
      });
    }

    const newId = new mongoose.Types.ObjectId();
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      _id: newId,
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    if (!jwt_Secret) throw new Error("jwt_secret token not found!");

    const token = jwt.sign(
      { id: newId.toString() },
      jwt_Secret,
      { expiresIn: token_expire_in }
    );

    return res.status(201).json({
      success: true,
      message: 'account created successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("register err:", error);
    return res.status(500).json({
      success: false,
      message: "register server err",
    });
  }
}

// login
export async function login(req, res) {
  try {
     await connectDB(); // MUST succeed or throw
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required!",
      });
    }

    const user = await User.findOne({ email });

    // First check user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid email or password!",
      });
    }

 const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "invalid email or password!",
      });
    }

    if (!jwt_Secret) throw new Error("jwt_secret token not found!");

    const token = jwt.sign(
      { id: user._id.toString() },
      jwt_Secret,
      { expiresIn: token_expire_in }
    );

    return res.status(200).json({
      success: true,
      message: 'login successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("login err:", error);
    return res.status(500).json({
      success: false,
      message: "login server err",
    });
  }
}
