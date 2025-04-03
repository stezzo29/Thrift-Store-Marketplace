const express = require('express');
const controller = require('../controllers/salesController');
const offerRoutes = require('./offerRoutes');
const { upload } = require('../middleware/fileUpload');
const {isGuest, isLoggedIn, isSeller} = require('../middleware/auth');
const { validateId, validateSale } = require('../middleware/validator');

const router = express.Router();

router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);  

router.get('/items', controller.items);  

router.get('/items/:id', validateId, controller.item);        
              
router.post('/items', isLoggedIn, upload, validateSale, controller.create);        
// router.put('/:id', upload, controller.update); // Updated route
router.delete('/items/:id', isLoggedIn, isSeller, validateId, controller.delete);
router.get('/items/:id/edit', isLoggedIn, isSeller, validateId, controller.edit);
router.put('/items/:id', isLoggedIn, isSeller, upload,validateId, validateSale, controller.updateExisting);
router.get('/search',  controller.search); // Ensure you have implemented this function

router.use('/:id/offer', isLoggedIn, offerRoutes);


module.exports = router;

