import { Router } from "express";
import { changeCurrentPassword, changeUserRole, createSuperAdmin, getAllUsers, loginUser, logoutUser, registerUser, updateUserAvatar, updateUserDetails, userAccountDetails, verifyEmail } from "../controllers/user.controller.js";
import { verifyJsonWebToken, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.route('/check').get((req, res) => {
     res.send('check completed')
})

router.route('/register').post(
     upload.fields(
          [
               {
                    name: 'avatar',
                    maxCount: 1
               },
          ]
     ),
     registerUser
)
router.route("/verify-email").post(verifyEmail)
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJsonWebToken, logoutUser)
router.route('/change-password').post(verifyJsonWebToken, changeCurrentPassword)
router.route('/update-avatar').patch(verifyJsonWebToken, upload.single('avatar'), updateUserAvatar)
router.route('/update-user-details').patch(verifyJsonWebToken, updateUserDetails)

router.route('/account-details').get(verifyJsonWebToken, userAccountDetails)
router.route('/change-role').post(verifyJsonWebToken, authorize('super_admin'), changeUserRole);

router.route('/all-users').get(verifyJsonWebToken, authorize('super_admin', 'admin'), getAllUsers)
// super admin creation routes

router.route('/create-super-admin').post(createSuperAdmin);



export default router;