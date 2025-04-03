const Offer = require('../models/offer');
const Sale = require('../models/sale');
const User = require('../models/user');


exports.makeOffer = (req, res, next) => {
    console.log('Full request body:', req.body);
    console.log('Sale ID:', req.params.id);
    console.log('Session user:', req.session.user);

    let id = req.params.id;
    
    Sale.findById(id)
        .then(sale => {
            console.log('Found Sale:', sale);
            
            if (!sale) {
                console.error('No item found with ID:', id);
                return res.status(404).send('Item not found');
            }
            
            let offer = new Offer({
                sale: id,
                buyer: req.session.user,
                amount: req.body.offer,
                saleTitle: sale.title
            });
            
            console.log('Created Offer:', offer);
            
            return offer.save();
        })
        .then(savedOffer => {
            console.log('Saved Offer:', savedOffer);
            req.flash('success', 'You have successfully made an offer!');
            res.redirect('/items/' + id);
        })
        .catch(err => {
            console.error('Error in makeOffer:', err);
            next(err);
        });
};

/*xports.getOffersPage = (req,res,next)=>{
    let id = req.params.id;
    Promise.all([Sale.findById(id), Offer.find({sale: id}).populate('buyer', 'firstName lastName email').sort({amount: -1})])
    .then(result => {
        const [sale, offers] = result;
        if (!sale) {
            let err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            return next(err);
        }
        //console.log(item._id.toHexString());
        res.render('./offer/offers', {sale: sale, offers: offers})
    })
    .catch(err=>next(err));
};
*/
exports.getOffersPage = (req,res,next)=>{
    let id = req.params.id;
    Promise.all([Sale.findById(id), Offer.find({sale: id}).populate('buyer', 'firstName lastName email').sort({amount: -1})])
    .then(result => {
        const [sale, offers] = result;
        if (!sale) {
            let err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            return next(err);
        }
        //console.log(item._id.toHexString());
        res.render('./offer/offers', {sale: sale, offers: offers})
    })
    .catch(err=>next(err));
};


exports.acceptOffer = (req, res, next) => {
    let id = req.params.id;          
    let offer_id = req.params.offer_id;  
    
    Promise.all([
        Offer.updateOne({ _id: offer_id }, { status: 'Accepted' }),
        Offer.updateMany({ _id: { $ne: offer_id }, sale: id }, { status: 'Rejected' }),
        Sale.updateOne({ _id: id }, { active: false })
    ])
    .then(() => {
        req.flash('success', 'You have successfully accepted an offer!');
        res.redirect('/items/' + id + '/offer');  // Match the route you defined
    })
    .catch(err => next(err));
};