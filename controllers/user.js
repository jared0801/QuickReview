const User = require('../models/user');
const Deck = require('../models/deck');
const { ErrorMsg, SuccessMsg } = require('../messages');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    /* GET /users/register */
    getRegister(req, res, next) {
        // Redirect if already authenticated
        if(req.isAuthenticated()) return res.redirect('/');
        res.render('register', { title: 'Register', username: '', email: '' });
    },
    /* POST /users/register */
    async postRegister(req, res, next) {
        try {
            // Destructure profile image if found
            if(req.file) {
                const { url, public_id } = req.file;
                req.body.image = { url, public_id };
            }
            // Create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                image: req.body.image
            });
            // Register & login the new user
            const user = await User.register(newUser, req.body.password);
            req.login(user, function(err) {
                if(err) return next(err);
                
                req.session.success = SuccessMsg.WELCOME_USER(user.username);
                res.redirect('/');
            });
        } catch(err) {
            // Delete the profile pic that was just created by multer
            deleteProfileImage(req);

            // Display appropriate error message
            const { username, email } = req.body;
            let error = err.message;
            if(error.includes('duplicate') && error.includes('index: email')) {
                error = ErrorMsg.USER_EMAIL_TAKEN;
            }
            res.render('register', { title: 'Register', username, email, error });
        }
    },
    /* GET /users/login */
    getLogin(req, res, next) {
        // Redirect if already authenticated
        if(req.isAuthenticated()) return res.redirect('/');

        // Store where the user came from if returnTo is set
        if(req.query.returnTo) {
            req.session.redirectTo = req.headers.referer;
        }
        res.render('login', { title: 'Login' });
    },
    /* POST /users/login */
    async postLogin(req, res, next) {
        // Destructure user
        const { username, password } = req.body;

        // Check user credentials
        const { user, error } = await User.authenticate()(username, password);

        if(!user && error) return next(error);

        req.login(user, function(err) {
            if(err) return next(err);
            req.session.success = SuccessMsg.WELCOME_BACK_USER(username);
            // Find appropriate place to redirect the user to
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
    },
    /* GET /users/logout */
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
    },
    /* GET /users/profile */
    async getProfile(req, res, next) {
        // Find the users 10 most recent decks
        const decks = await Deck.find().where('author').equals(req.user._id).limit(10).exec();

        res.render('profile', { decks });
    },
    async updateProfile(req, res, next) {
        const {
            username,
            email
        } = req.body;
        const { user } = res.locals;
        
        // Update user fields
        if(username) user.username = username;
        if(email) user.email = email;

        // Update user image
        if(req.file) {
            // Destroy any existing image
            if(user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
            // Set new user image (already uploaded by multer)
            const { url, public_id } = req.file;
            user.image = { url, public_id };
        }
        // Save & login
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
        req.session.success = SuccessMsg.PROFILE_UPDATED;
        res.redirect('/users/profile');
    },
    getForgotPw(req, res, next) {
        res.render('users/forgot');
    },
    async putForgotPw(req, res, next) {
        // Generate token
        const token = await crypto.randomBytes(20).toString('hex');

        // Find user
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            req.session.error = ErrorMsg.USER_NOT_FOUND;
            return res.redirect('/users/forgot-password');
        }
        
        // Assign token to the user if found
        user.resetPasswordToken = token;
        // Set token to expire in 1 hour
        user.resetPasswordExpires = Date.now() + 3600000;
        // Save user to db
        await user.save();

        // Create sendgrid message
        const msg = {
            to: email,
            from: 'Jared0801@gmail.com',
            subject: 'QuickReview - Forgot Password / Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/users/reset/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			/g, '')
          };
          // Send email to user
          try {
            await sgMail.send(msg);
          } catch(e) {
              console.log(e);
              console.log(e.response.body.errors);
              throw new Error(e);
          }

          req.session.success = SuccessMsg.SUCCESS_EMAIL;
          res.redirect('/users/forgot-password');
    },
    async getReset(req, res, next) {
        const { token } = req.params;
        // Find user based on the request token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!user) {
            req.session.error = ErrorMsg.INVALID_RESET_TOKEN;
            return res.redirect('/users/forgot-password');
        }

        res.render('users/reset', { token });
    },
    async putReset(req, res, next) {
        const { token } = req.params;
        // Find user based on the request token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!user) {
            req.session.error = ErrorMsg.INVALID_RESET_TOKEN;
            return res.redirect('/users/forgot-password');
        }

        // Update the users password
        if(req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.session.error = ErrorMsg.PASS_CONF_MATCH;
            return res.redirect(`/users/reset/${ token }`);
        }

        // Send an email to notify the user of changes
        // Create sendgrid message
        const msg = {
            to: user.email,
            from: 'Jared0801@gmail.com',
            subject: 'QuickReview - Password Changed',
            text: `Hello,
            This email is to confirm that the password for your account has just been changed.
            If you did not make this change, please hit reply and notify us at once.`.replace(/            /g, '')
          };
          // Send email to user
          await sgMail.send(msg);

          req.session.success = SuccessMsg.PASS_UPDATED;
          res.redirect('/');
    }
}