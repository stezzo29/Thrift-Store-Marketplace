const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute time window
    max: 5, // limit each IP to 5 requests per windowMs
    //message: 'Too many login attempts, please try again later'
    handler: (req, res, next) => {
        let err = new Error('Too many login attempts, please try again later');
        err.status = 429;
        return next(err);
    }
});