import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// import routes
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'
import orderRouter from './routes/order.routes.js'
import paymentRouter from './routes/payment.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import reviewRouter from './routes/review.routes.js'
import cartRouter from './routes/cart.routes.js'
import shippingRouter from './routes/shipping.routes.js'
import { User } from './models/user.model.js';
import { GenerateAccessAndRefreshToken } from './controllers/user.controller.js';
import { handleError } from './utils/handleError.js';
import { handleSuccess } from './utils/handleSuccess.js';
import { options } from './constant.js';

const app = express();


// Configure session middleware
app.use(session({
     secret: process.env.SESSION_SECRET || 'googlesession',
     resave: false,
     saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session())

// Configure Google Strategy
passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: `${process.env.BASE_URL}/auth/google/callback`
},
     async (accessToken, refreshToken, profile, done) => {
          // console.log('data got from google auth accesstoken: ', accessToken, "refreshtoken", refreshToken, "profile : ", profile);
          // console.log("=============================");

          try {
               // Check if user already exists
               let user = await User.findOne({ email: profile.emails[0].value });
               // console.log('user :', user);
               // console.log("=============================");

               if (user) {
                    // User exists, update their access and refresh tokens
                    user.accessToken = accessToken;
                    user.refreshToken = refreshToken;
                    await user.save();
               } else {
                    // Create a new user
                    user = new User({
                         fullName: profile.displayName,
                         email: profile.emails[0].value,
                         avatar: profile.photos[0].value,
                         authId: profile.id,
                         authProvider: "google",
                         isVerified: profile.emails[0].verified,
                         accessToken: accessToken,
                         refreshToken: refreshToken,
                         password: 'N/A' // Set a dummy password since it's not required
                    });

                    await user.save();
                    // console.log('user not found thats why we create user :', user);
                    // console.log("=============================");
               }

               // Generate access and refresh tokens
               const tokens = await GenerateAccessAndRefreshToken(user._id);
               // console.log('tokens : ', tokens);
               // console.log("=============================");

               // Attach tokens to user object
               user.accessToken = tokens.accessToken;
               user.refreshToken = tokens.refreshToken;

               done(null, user);

          } catch (error) {
               done(error, false);
          }
     }
));


passport.serializeUser((user, done) => {
     // console.log('google user : ', user);
     done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
     try {
          const user = await User.findById(id)
          // console.log('google user : ', user);
          done(null, user);
     } catch (error) {
          done(error, false);
     }
});

// Routes for google authentication
app.get('/auth/google',
     passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback',
//      passport.authenticate('google', { failureRedirect: '/login' }),
//      async (req, res) => {
//           try {
//                const user = req.user;
//                const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(user._id);

//                // Prepare user object (similar to manual login)
//                const userResponse = {
//                     _id: user._id,
//                     fullName: user.fullName,
//                     email: user.email,
//                     avatar: user.avatar,
//                     role: user.role,
//                     // Add any other necessary fields
//                };

//                // Set cookies
//                res.cookie('accessToken', accessToken, options);
//                res.cookie('refreshToken', refreshToken, options);

//                // Redirect to your client application with user data
//                const encodedUserData = encodeURIComponent(JSON.stringify(userResponse));
//                res.redirect(`${process.env.CLIENT_URL}/auth-success?userData=${encodedUserData}`);
//           } catch (error) {
//                console.error('Error in Google authentication callback:', error);
//                res.redirect(`${process.env.CLIENT_URL}/auth-error`);
//           }
//      }
// );

app.get('/auth/google/callback',
     passport.authenticate('google', { failureRedirect: '/login' }),
     async (req, res) => {
          try {
               const user = req.user;
               const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(user._id);

               // Prepare user object (similar to manual login)
               const userResponse = {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    // Add any other necessary fields
               };

               // Set cookies
               res.cookie('accessToken', accessToken, options);
               res.cookie('refreshToken', refreshToken, options);

               // Redirect to your client application with user data and access token
               const encodedUserData = encodeURIComponent(JSON.stringify(userResponse));
               res.redirect(`${process.env.CLIENT_URL}/auth-success?userData=${encodedUserData}&accessToken=${accessToken}&refreshToken=${refreshToken}`);
          } catch (error) {
               console.error('Error in Google authentication callback:', error);
               res.redirect(`${process.env.CLIENT_URL}/auth-error`);
          }
     }
);


// cors options for google auth
const corsOptions = {
     origin: process.env.CLIENT_URL,
     credentials: true,
     optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
     res.send('check')
})


//declare routes
app.use('/api/v1/shipping', shippingRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/payment', paymentRouter)
app.use('/api/v1/wishlist', wishlistRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/user', userRouter)


export { app };