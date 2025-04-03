const e = require('express');
const model = require('../models/sale');
const Offer = require('../models/offer');

// Display the index page, optionally filtered by a search query
exports.search = (req, res, next) => {
    const searchVar = req.query.query; // Get the search term from the query

    console.log('Search Query:', searchVar); // Debugging log

    if (!searchVar || searchVar.trim() === '') {
        return res.redirect('/items'); // Redirect if search is empty
    }

    // Create a search condition f
    const searchCondition = {
        $or: [
            { title: { $regex: searchVar, $options: 'i' } },  // Search by item title
            { seller: { $regex: searchVar, $options: 'i' } }    // Search by seller name
        ],
        active: true  
    };

    model.find(searchCondition)
        .then(sales => {
            console.log('Search Results:', sales); // Log search results
            res.render('sale/items', { sales });
        })
        .catch(err => next(err));
};

// Display the form for creating a new item
exports.new = (req, res) => {
    res.render('sale/new');
};


exports.item = (req, res, next) => {
    const id = req.params.id;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Check for valid MongoDB ObjectId format
        const err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .populate('seller', 'firstName lastName')  // Populate seller's name
        .then(sale => {
            if (sale) {
                res.render('./sale/item', { sale });
            } else {
                const err = new Error('Cannot find listing with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// Fetch and display all items
exports.items = (req, res, next) => {
    model.find()  // Fetch all items from the database
        .sort({price: 1})
        .then(sales => {
            res.render('./sale/items', { sales });  // Pass items to the view
        })
        .catch(err => {
            console.error('Error fetching items:', err);
            next(err);  // Pass any error to the error handler middleware
        });
};


exports.delete = (req,res,next)=>{
    let id = req.params.id;
    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}), Offer.deleteMany({sale: id})])
    .then(sale=>{
        req.flash('success', 'You have successfully deleted this listing!');
        res.redirect('/items')
    })
    .catch(err=>next(err));
};

// Display the form for editing an existing item
exports.edit = (req, res, next) => {
    const id = req.params.id;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Check for valid ObjectId
        const err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .then(sale => {
            if (sale) {
                res.render('./sale/edit', { sale });
            } else {
                const err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// Display the index page
exports.index = (req, res) => {
    res.render('sale/index'); // Adjust this as needed
};

// Create a new item
exports.create = (req, res, next) => {
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
        let err = new Error('Image file is required');
        err.status = 400;
        return next(err);
    }

    let item = new model(req.body);
    item.image = req.file.filename;
    item.seller = req.session.user;
    
    item.save()
        .then(sales => {
            res.redirect('/items');
        })
        .catch(err => {
            console.log('Error:', err);  // Log the error
            if (err.name === 'ValidationError') {
                err.status = 400;
                res.status(400).send({ message: err.message, errors: err.errors });
            } else {
                next(err);
            }
        });
};




// Update an existing items

exports.updateExisting = (req, res, next) => {
    let sale = req.body;
    let id = req.params.id;

    // Validate the ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        const err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .then(currentSale => {
            if (!currentSale) {
                const err = new Error('Cannot find listing with id ' + id);
                err.status = 404;
                throw err;
            }

            // Check if the logged-in user is the seller
            if (currentSale.seller.toString() !== req.session.user.toString()) {
                const err = new Error('You are not authorized to edit this item');
                err.status = 403;
                throw err;
            }

            // Keep the existing image if none is uploaded
            sale.image = req.file ? req.file.filename : currentSale.image;

            // Perform the update
            return model.findByIdAndUpdate(id, sale, { 
                useFindAndModify: false, 
                runValidators: true,
                new: true 
            });
        })
        .then(updatedSale => {
            req.flash('success', 'Item updated successfully!');
            res.redirect('/items/' + id);
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
                return res.status(400).render('edit', { 
                    sale: sale, 
                    errors: err.errors 
                });
            } else {
                next(err);
            }
        });
};



