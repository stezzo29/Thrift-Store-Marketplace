const Sale = require('../models/sale');

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
    next();
};

exports.isSeller = (req, res, next) => {
    let id = req.params.id;

    Sale.findById(id)
        .populate('seller', '_id')  // Populate seller with just the ID to compare
        .then(sale => {
            if (sale) {
                // Check if the logged-in user is the seller
                if (sale.seller._id.toString() === req.session.user.toString()) {
                    return next();
                } else {
                    const err = new Error('You are not authorized to edit this item');
                    err.status = 403;  // Forbidden
                    return next(err);
                }
            } else {
                const err = new Error('Cannot find sale with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.isNotSeller = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    Sale.findById(id)
    .then(sale => {
        if (sale) {
            if (sale.seller != req.session.user) {
                return next();
            } else {            
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

