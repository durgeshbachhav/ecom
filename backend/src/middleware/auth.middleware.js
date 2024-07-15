// import jsonwebtoken from 'jsonwebtoken'
// import { User } from '../models/user.model.js'
// import { handleError } from '../utils/handleError.js'
// import { asyncHandler } from '../utils/asyncHandler.js'

// export const verifyJsonWebToken = asyncHandler(async (req, _, next) => {
//      try {
//           console.log("request cookies===>", req.cookies);
//           const token = req.cookies?.accessToken || req.headers('Authorization')?.replace("Bearer ", "");
//           console.log('token ===> ', token)

//           if (!token) {
//                throw new handleError(401, "auth.middleware.js = > unauthorized access token")
//           }

//           const decodedToken = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET)
//           console.log('decoded token ',decodedToken)
//           const user = await User.findById(decodedToken?._id)
//           console.log('user auth backend ',user);
//           if (!user) {
//                throw new handleError(400, 'auth.middleware.js = > invalid access token user cannot go to the next step');
//           }
//           console.log("user => ", user);

//           req.user = user;

//           next();
//      } catch (error) {
//           throw new handleError(500, error?.message || 'auth.middleware.js getting something wrong')
//      }
// })


// export const authorize = (...roles) => {
//      return (req, res, next) => {
//        if (!req.user) {
//          throw new handleError(401, "Unauthorized access");
//        }
//        if (!roles.includes(req.user.role)) {
//          throw new handleError(403, "Forbidden: You don't have permission to access this resource");
//        }
//        next();
//      };
//    };




import jsonwebtoken from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { handleError } from '../utils/handleError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyJsonWebToken = asyncHandler(async (req, res, next) => {
    try {

        // console.log("request cookies===>", req.cookies);
        // const token = req.cookies?.accessToken;

        // console.log('token ===> ', token);

        // if (!token) {
        //     return next(new handleError(401, "Unauthorized access token"));
        // }

        console.log("request cookies===>", req.cookies);
        const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");

        console.log('token ===> ', token);

        if (!token) {
            return next(new handleError(401, "Unauthorized access token"));
        }

        const decodedToken = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('decoded token ', decodedToken);

        const user = await User.findById(decodedToken?._id);
        console.log('user auth backend ', user);

        if (!user) {
            return next(new handleError(400, 'Invalid access token, user not found'));
        }
        console.log("user => ", user);

        req.user = user;
        next();
    } catch (error) {
        return next(new handleError(500, error?.message || 'Something went wrong in authentication middleware'));
    }
});

export const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('User role:', req.user.role);
        console.log('Required roles:', roles);
        
        // Correctly check if the user's role matches any of the required roles
        const userHasRole = roles.some(role => req.user.role === role);
        console.log('user roles : ', userHasRole);
        
        if (!req.user) {
            return next(new handleError(401, "Unauthorized access"));
        }
        
        // Use the result of userHasRole to determine if the user has the necessary role
        if (!userHasRole) {
            return next(new handleError(403, "Forbidden: You don't have permission to access this resource"));
        }
        
        next();
    };
};


