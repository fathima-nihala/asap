const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: [true, "Please enter your first name"],
        trim: true,
        maxlength: [30, "First name cannot exceed 30 characters"],
    },
    l_name: {
        type: String,
        required: [true, "Please enter your last name"],
        trim: true,
        maxlength: [30, "Last name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"],
    },
    phone: {
        type: String,
    },
    profile: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        select: false,
        minlength: [6, "Password must be at least 6 characters"],
    },
},{timestamps:true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.getJWTtoken = function () {
    return JWT.sign({ id: this._id }, process.env.JWT_SEC, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
