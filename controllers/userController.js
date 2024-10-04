
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const availableUser = await User.findOne({ email });
    if (availableUser) {
        res.status(400);
        throw new Error("User with emailId already exists!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword })
    if (user) {
        res.status(201).json({ userId: user.id, username: user.username, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data not valid!!")
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );
        res.status(200).json({ token: accessToken, userId: user.id, username: user.username });
    } else {
        res.status(400);
        throw new Error("Email or Password not valid!");
    }
});


const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (user) {
        res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email,
            profileData: user.profileData ? user.profileData : {}
        });
    }
});


const updateUser = asyncHandler(async (req, res) => {
    const existingUser = await User.findById(req.params.userId);
    if (!existingUser) {
        res.status(400);
        throw new Error("User Not Found!");
    }
    const { password } = req.body;
    if (password) {
        res.status(400);
        throw new Error("Password can't be modified!");
    }
    const updateUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {
            new: true
        }
    )
    res.status(200).json(updateUser)
});

const deleteUser = asyncHandler(async (req, res) => {
    const existingUser = await User.findById(req.params.userId);
    if (!existingUser) {
        res.status(400);
        throw new Error("User Not Found!");
    }
    await User.findByIdAndDelete(
        req.params.userId

    )
    res.status(200).json({ title: "Success", message: "User deleted successfully!!" })
});

const changePassword = asyncHandler(async (req, res) => {
    const existingUser = await User.findById(req.params.userId);
    if (!existingUser) {
        res.status(400);
        throw new Error("User Not Found!");
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        res.status(400);
        throw new Error("Password is mandatory!");
    }
    if (oldPassword === newPassword) {
        res.status(400);
        throw new Error("Old password and new password can't be the same!");
    }
    if (await bcrypt.compare(oldPassword, existingUser.password)) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(
            req.params.userId,
            { password: hashedPassword },
            {
                new: true
            }
        );
        res.status(200).json({ title: "Success", message: "password updated successfully!!" })
    } else {
        res.status(403);
        throw new Error("Incorrect password!");
    }
});

const verifyToken = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const checkUserRole = asyncHandler(async (req, res) => {
    if (req.user.username === "admin") {
        res.status(200).json({ userRole: "admin" });
    } else {
        res.status(200).json({ userRole: "nonadminuser" });
    }
})







module.exports = { registerUser, loginUser, getUserProfile, updateUser, deleteUser, changePassword, verifyToken, checkUserRole }