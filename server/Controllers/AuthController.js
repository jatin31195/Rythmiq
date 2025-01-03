import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../Models/User.js";

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: 'User already exists, please login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save(); // User saved

        const jwtToken = jwt.sign(
            { email: newUser.email, _id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Signup successful",
            success: true,
            jwtToken,
            email: newUser.email,
            name: newUser.name,
            userId: newUser._id 
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Authentication failed: email or password is incorrect';
        
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name,
            userId: user._id 
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}



export { signup, login};
