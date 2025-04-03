const { body } = require('express-validator');
const { validationResult } = require('express-validator');


exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    body('firstName', 'Fist name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail({gmail_remove_dots: false}).notEmpty(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64}).notEmpty()
];

exports.validateLogin = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail({gmail_remove_dots: false}),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateSale = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('price', 'Price must be a number').isNumeric().toFloat({ gt: 0 }).notEmpty(),
    body('size', 'Size cannot be empty').notEmpty().trim().escape(),
    body('condition', 'Condition must be a valid condition').isIn(['Brand New', 'Like New', 'Gently Used', 'Well-worm', 'Heavily-Used']).notEmpty(),
    body('details', 'Details cannot be empty').notEmpty().trim().escape().isLength({min: 10, max: 500}),
    body('image', 'Image cannot be empty').notEmpty()
];

exports.validateOffer = [
    body('offer', 'Offer must be a number').isNumeric().toFloat({ gt: 0 }).trim().escape().notEmpty()
];

exports.validateResult = (req,res,next)=>{
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        })
        return res.redirect('back');
    } else {
        return next();
    }
};
