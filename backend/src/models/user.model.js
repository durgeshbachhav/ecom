import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const addressSchema = new Schema({
     _id: { type: Schema.Types.ObjectId, auto: true },
     country: String,
     street: String,
     city: String,
     state: String,
     zip: String,
});
const userSchema = new Schema({
     fullName: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
     },
     password: {
          type: String,
          required: [true, 'Password is required']
     },
     avatar: {
          type: String,
     },
     addresses: [addressSchema],
     phone: [
          { type: String }
     ],
     isAdmin: {
          type: Boolean,
          default: false
     },
     authProvider: {
          type: String,
          enum: ['google', 'facebook', 'twitter', 'local'],
          default: 'local'
     },
     authId: {
          type: String,
          index: true
     },
     accessToken: {
          type: String,
     },
     refreshToken: {
          type: String,
     },
     isVerified: {
          type: Boolean,
          default: false
     },
     forgotPasswordToken: {
          type: String
     },
     forgotPasswordTokenExpiry: {
          type: Date,
     },
     verifyToken: {
          type: String
     },
     verifyTokenExpiry: {
          type: Date,
     },
     role: {
          type: String,
          enum: ['user', 'admin', 'super_admin'],
          default: 'user'
     },
}, {
     timestamps: true
});

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
     try {
          if (!this.isModified("password")) return next();

          const hashedPassword = await bcrypt.hash(this.password, 10);
          this.password = hashedPassword;
          next();
     } catch (error) {
          next(error);
     }
});

// Method to validate user's password
userSchema.methods.isPasswordValid = async function (password) {
     try {
          return await bcrypt.compare(password, this.password);
     } catch (error) {
          return false;
     }
};

// Method to generate JWT access token
userSchema.methods.generateAccessToken = function () {
     return jwt.sign({
          _id: this._id,
          email: this.email,
          fullName: this.fullName
     }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' // Default expiry of 1 day
     });
};

// Method to generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
     return jwt.sign({
          _id: this._id
     }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' // Default expiry of 7 days
     });
};

export const User = mongoose.model("User", userSchema);
