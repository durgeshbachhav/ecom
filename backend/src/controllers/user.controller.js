import { options } from '../constant.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { handleError } from '../utils/handleError.js';
import jsonwebtoken from 'jsonwebtoken'
import { handleSuccess } from '../utils/handleSuccess.js';
import { sendVerificationEmail } from './notification.controller.js';
import { User } from '../models/user.model.js';
import { uploadCloudinary } from '../services/cloudinary.js';

const GenerateAccessAndRefreshToken = async (userId) => {
     try {
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken();
          const refreshToken = user.generateRefreshToken();
          user.refreshToken = refreshToken
          await user.save({ validateBeforeSave: false })

          return { accessToken, refreshToken }

     } catch (error) {
          throw new handleError(400, 'error while generating accesstoken and refreshtoken')
     }
}

const registerUser = asyncHandler(async (req, res) => {
     try {
          const { fullName, email, password, phone } = req.body;
          console.log('data', fullName, email, password, phone)
          if ([fullName, email, password, phone].some((feild) => feild?.trim() === "")) {

               throw new handleError(400, 'all feilds are required')
          }
          // check user is already register or not
          const isAlreadyUser = await User.findOne({ email })
          console.log('is already user', isAlreadyUser)
          if (isAlreadyUser) {
               throw new handleError(400, 'user already exist')
          }
          const avatarLocalPath = req.files?.avatar[0]?.path;
          console.log('avatar path =>', avatarLocalPath);
          if (!avatarLocalPath) {
               throw new handleError(400, 'user avatar is required')
          }
          const avatar = await uploadCloudinary(avatarLocalPath);
          if (!avatar) {
               throw new handleError(400, 'user avatar is required')
          }
          const user = await User.create({
               fullName,
               email,
               password,
               avatar: avatar?.url,
               phone,
               role: "user"
          })
          await sendVerificationEmail(user);
          const createdUser = await User.findById(user?._id)
          // .select("-password -refreshToken")
          console.log('created user ====>', createdUser)
          if (!createdUser) {
               throw new handleError(400, 'something went wrong while creating user');
          }
          return res.status(201).json(
               new handleSuccess(200, createdUser, "user created successfully")
          )
     } catch (error) {
          console.log('error', error)
     }
})

const loginUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body;

     console.log('email ::', email)
     console.log('password ::', password)


     if ([email, password].some((feild) => feild?.trim() === "")) {
          throw new handleError(400, 'all feilds are required')
     }

     const user = await User.findOne({ email })
     if (!user) {
          throw new handleError(400, 'user not exist')
     }
     console.log('user', user)
     const isPasswordCorrect = await user.isPasswordValid(password)

     if (!isPasswordCorrect) {
          throw new handleError(400, 'wrong password')
     }
     console.log('is correct', isPasswordCorrect)
     const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(user._id);
     const logInUser = await User.findById(user._id)
     // .select("-password -refreshToken");

     return res
          .status(200)
          .cookie('accessToken', accessToken, options)
          .cookie('refreshToken', refreshToken, options)
          .json(
               new handleSuccess(200,
                    {
                         user: logInUser.toObject(),
                         accessToken, refreshToken,
                         role: logInUser.role // Ensure role is included
                    },
                    "user login successfully"
               )
          )

})

const updateUserDetails = asyncHandler(async (req, res) => {
     const { fullName, email, addresses, phone } = req.body;
     console.log("fullName, email, addresses, phone ", fullName, email, addresses, phone)

     // Validate input
     if (!email) {
          throw new handleError(400, 'user not found');
     }

     // Validate email format
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
          throw new handleError(400, 'Invalid email format');
     }

     try {
          const updateuser = await User.findByIdAndUpdate(
               req.user._id,
               {
                    $set: {
                         fullName,
                         email,
                         addresses,
                         phone,
                    }
               },
               {
                    new: true
               }
          ).select("-password");



          return res
               .status(200)
               .json(
                    new handleSuccess(200,
                         { user: updateuser },
                         "user details updated successfully"
                    )
               );
     } catch (error) {
          throw new handleError(500, 'Internal Server Error');
     }
});

const logoutUser = asyncHandler(async (req, res) => {
     const user = req.body._id;
     await User.findByIdAndUpdate(
          user,
          {
               $unset: {
                    RefreshToken: 1 // this remove feild from documents
               }
          },
          {
               new: true
          }
     )

     return res
          .status(200)
          .clearCookie('accessToken', options)
          .clearCookie('refreshToken', options)
          .json(
               new handleSuccess(200, {}, 'user logout successfully')
          )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
     const incomingRefreshToken = req.cookie.RefreshToken || req.body.RefreshToken;

     if (!refreshAccessToken) {
          throw new handleError(400, 'unauthorized user');
     }

     try {
          const decodedToken = jsonwebtoken.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECREAT)

          const user = await User.findById(decodedToken?._id);

          if (!user) {
               throw new handleError(400, 'user not exist');
          }
          if (incomingRefreshToken !== user?.RefreshToken) {
               throw new handleError(400, 'refreshtoken is expire or used')
          }
          const { AccessToken, newRefreshToken } = await GenerateAccessAndRefreshToken(user?._id)

          return res
               .status(200)
               .cookie('accessToken', AccessToken, options)
               .cookie('refreshToken', newRefreshToken, options)
               .json(
                    new handleSuccess(
                         200,
                         {
                              AccessToken, RefreshToken: newRefreshToken
                         },
                         'access token is refresh'
                    )
               )

     } catch (error) {
          throw new handleError(401, error?.message || 'invalid refresh token')
     }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
     const { oldPassword, newPassword } = req.body;
     const user = await User.findById(req.user?._id)

     const isPasswordCorrect = await user.isPasswordValid(oldPassword)
     if (!isPasswordCorrect) {
          throw new handleError(400, 'invalid old password')
     }
     user.password = newPassword
     await user.save({ validateBeforeSave: false })

     return res
          .status(200)
          .json(
               new handleSuccess(200, { newPassword }, "password change successfully")
          )
})

const userAccountDetails = asyncHandler(async (req, res) => {


     // Find the user by ID without updating
     const user = await User.findById(req.user?._id).select("-password");
     console.log('userAccountDetails : ', user);
     if (!user) {
          throw new handleError(404, 'User not found');
     }

     const response = new handleSuccess(200, 'User account details fetched successfully', user);
     return res.status(200).json(response);
});

const updateUserAvatar = asyncHandler(async (req, res) => {
     const avatarLocalPath = req.file?.path

     if (!avatarLocalPath) {
          throw new handleError(400, 'avatar file is missing')
     }

     const avatar = await uploadCloudinary(avatarLocalPath);

     if (!avatar) {
          throw new handleError(400, 'error while uploading avatar')
     }
     const user = await User.findByIdAndUpdate(
          req.user?._id,
          {
               $set: {
                    avatar: avatar.url
               }
          },
          {
               new: true
          }
     ).select("-password")

     const response = new handleSuccess(200, 'Avatar image upload successfully', user);

     return res
          .status(200)
          .json(response);
})

const verifyEmail = asyncHandler(async (req, res) => {
     const { token } = req.body;
     console.log("Received token:", token);

     const user = await User.findById(token);

     if (!user) {
          console.error("User not found for token:", token);
          throw new handleError(400, 'User not found');
     }

     if (user.verifyTokenExpiry < Date.now()) {
          console.error("Token expired for user:", user.email);
          throw new handleError(400, 'Token expired');
     }

     console.log("User found:", user);

     user.isVerified = true;
     user.verifyToken = undefined; // Clear the token
     user.verifyTokenExpiry = undefined; // Clear the expiry

     await user.save();
     return res.status(200).json(new handleSuccess(200, 'Email verified successfully'));
});

const changeUserRole = asyncHandler(async (req, res) => {
     const { email, newRole } = req.body;

     if (!['user', 'admin', 'super_admin'].includes(newRole)) {
          throw new handleError(400, 'Invalid role');
     }

     const user = await User.findOneAndUpdate(
          { email: email },
          { role: newRole },
          { new: true }
     ).select("-password");

     if (!user) {
          throw new handleError(404, 'User not found');
     }

     return res.status(200).json(
          new handleSuccess(200, "User role updated successfully", user)
     );
});

const createSuperAdmin = asyncHandler(async (req, res) => {
     const { email, password, fullName, secretKey } = req.body;

     // Check if the secret key matches
     if (secretKey !== process.env.SUPER_ADMIN_SECRET_KEY) {
          throw new handleError(403, 'Invalid secret key');
     }

     // Check if a super admin already exists
     const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
     if (existingSuperAdmin) {
          throw new handleError(400, 'A super admin already exists');
     }

     const user = await User.create({
          fullName,
          email,
          password,
          role: 'super_admin',
          isVerified: true // Automatically verify the super admin
     });

     return res.status(201).json(
          new handleSuccess(201, { email: user.email }, "Super admin created successfully")
     );
});


// only for admin
const getAllUsers = asyncHandler(async (req, res) => {
     try {
          const users = await User.find({});
          if (users.length > 0) {
               return res.status(200).json(
                    new handleSuccess(200, 'users fetch successfully', users)
               )

          } else {
               return res.status(200).json(new handleSuccess(200, 'not user account fetching because users available', users));
          }
     } catch (error) {
          console.error(error);
          throw new handleError(400, 'getting error while fetching all users');
     }
});


export {
     GenerateAccessAndRefreshToken,
     registerUser,
     loginUser,
     logoutUser,
     refreshAccessToken,
     changeCurrentPassword,
     userAccountDetails,
     updateUserAvatar,
     verifyEmail,
     changeUserRole,
     createSuperAdmin,
     updateUserDetails,
     getAllUsers
}