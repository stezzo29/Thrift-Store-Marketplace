const express = require('express');
const router = express.Router({ mergeParams: true});
const controller = require('../controllers/offerController');
const { isLoggedIn, isSeller, isNotSeller } = require('../middleware/auth');
const { validateId, validateOffer } = require('../middleware/validator');



// GET -> / : Get all offers
//router.get('/', isSeller, validateId, controller.getOffersPage);
//router.get('/items/:id/offers', isSeller, validateId, controller.getOffersPage);
router.get('/:id/offer', isSeller, validateId, controller.getOffersPage);

// POST -> /makeOffer : Create a new offer
router.post('/:id/offer/makeOffer', isNotSeller, validateId, validateOffer, controller.makeOffer);
//router.post('/makeOffer', isNotAuthor, validateId, validateOffer, controller.makeOffer);

// POST -> /:offer_id/acceptOffer : Accept an offer
router.post('/:id/offer/:offer_id/acceptOffer', isSeller, validateId, controller.acceptOffer);

module.exports = router;