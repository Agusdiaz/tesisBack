const router = require('express').Router();
const auth = require('./auth/authToken');
const ClientController = require('./controllers/ClientController');
const ShopController = require('./controllers/ShopController');
const OrderController = require('./controllers/OrderController');
const ProductController = require('./controllers/ProductController');
const IngredientController = require('./controllers/IngredientController');
const PaymentController = require('./controllers/PaymentController');
const PromoController = require('./controllers/PromoController');

router.post('/login', function(req, res){
  ClientController.loginUser(req, res);
})

router.post('/verifyToken', function(req, res){
  auth.verifyToken(req, res); 
})

router.post('/getShopMenu', auth.middleware, function(req, res){
  ProductController.getShopMenu(req, res);
})

router.post('/getShopPromos', auth.middleware, function(req, res){
  PromoController.getShopPromos(req, res);
})

router.post('/changePassword', auth.middleware, function(req, res){
  ClientController.changePassword(req, res);
})

//PARA CLIENTE
router.post('/insertClient', function(req, res){
  ClientController.insertClient(req, res);
})

router.post('/updateClient', auth.middleware, function(req, res){
  ClientController.setClient(req, res);
})

router.post('/getFavourites', auth.middleware, function(req, res){
  ShopController.getClientFavourites(req, res);
})

router.post('/setShopAsFavourite', auth.middleware, function(req, res){
  ShopController.setShopAsFavourite(req, res);
})

router.post('/deleteShopAsFavourite', auth.middleware, function(req, res){
  ShopController.deleteShopAsFavourite(req, res);
})

router.post('/getShopByName', auth.middleware, function(req, res){
  ShopController.getShopByName(req, res);
})

router.post('/getShopByAddress', auth.middleware, function(req, res){
  ShopController.getShopByAddress(req, res);
})

router.post('/getShopByPromo', auth.middleware, function(req, res){
  ShopController.getShopsByPromos(req, res);
})

router.post('/getAllShopsOpenClose', auth.middleware, function(req, res){
  ShopController.getAllShopsOpenClose(req, res);
})

router.post('/getAllShopsAZ', auth.middleware, function(req, res){
  ShopController.getAllShopsAZ(req, res);
})

router.post('/getAllOpenShops', auth.middleware, function(req, res){
  ShopController.getAllOpenShops(req, res);
})

router.post('/setOrderDeliveredByClient', auth.middleware, function(req, res){
  OrderController.setOrderDeliveredByClient(req, res);
})

router.post('/shareOrder', auth.middleware, function(req, res){
  OrderController.shareOrder(req, res);
})

router.post('/insertPayment', auth.middleware, function(req, res){
  PaymentController.insertPayment(req, res);
})

router.post('/getPendingOrdersByClient', auth.middleware, function(req, res){
  OrderController.getClientPendingOrders(req, res);
})

router.post('/getAllOrdersByClient', auth.middleware, function(req, res){
  OrderController.getClientAllOrders(req, res);
})

router.post('/insertClientOrder', auth.middleware, function(req, res){
  OrderController.insertClientOrder(req, res);
})

router.post('/deleteClientOrder', auth.middleware, function(req, res){
  OrderController.deleteClientOrder(req, res);
})

router.post('/validateClosingShop', auth.middleware, function(req, res){
  ShopController.validateSoonClosingShop(req, res);
})


//PARA LOCAL
router.post('/insertShop', function(req, res){
  ShopController.insertShop(req, res);
})

router.post('/setOrderReadyByShop', auth.middleware, function(req, res){
  OrderController.setOrderReadyByShop(req, res);
})

router.post('/getAllDisabledByShop', auth.middleware, function(req, res){
  ProductController.getAllDisabledByShop(req, res);
})

router.post('/updateIngredientStatus', auth.middleware, function(req, res){
  IngredientController.setIngredientStatus(req, res);
})

router.post('/updateProductStatus', auth.middleware, function(req, res){
  ProductController.setProductStatus(req, res);
})

router.post('/updateShopFeatures', auth.middleware, function(req, res){
  ShopController.setShopFeatures(req, res);
})

router.post('/updateShopSchedule', auth.middleware, function(req, res){
  ShopController.setShopSchedule(req, res);
})

router.post('/deleteShopSchedule', auth.middleware, function(req, res){
  ShopController.deleteShopSchedule(req, res);
})

router.post('/insertShopSchedule', auth.middleware, function(req, res){
  ShopController.insertShopSchedule(req, res);
})

router.post('/getPendingOrdersInOrderByShop', auth.middleware, function(req, res){
  OrderController.getShopPendingOrdersByArrival(req, res);
})

router.post('/getPendingOrdersMoreProductsByShop', auth.middleware, function(req, res){
  OrderController.getShopPendingOrdersByProducts(req, res);
})

router.post('/getDeliveredOrdersByShop', auth.middleware, function(req, res){
  OrderController.getShopDeliveredOrdersByArrival(req, res);
})

router.post('/aceptClientOrder', auth.middleware, function(req, res){
  OrderController.aceptClientOrder(req, res);
})

router.post('/getTop10RequestedProductsByShop', function(req, res){ //auth.middleware
  ShopController.getTop10RequestedProductsByShop(req, res);
})

router.post('/getTopRequestedHoursByShop', auth.middleware, function(req, res){
  ShopController.getTopRequestedHoursByShop(req, res);
})

router.post('/getLast6MonthOrdersByShop', auth.middleware, function(req, res){
  ShopController.getLast6MonthOrdersByShop(req, res);
})

router.post('/insertProductWithIngredients', auth.middleware, function(req, res){
  ProductController.insertProductWithIngredients(req, res);
})

router.post('/insertPromoWithProducts', auth.middleware, function(req, res){
  PromoController.insertPromoWithProducts(req, res);
})

router.post('/getAllIngredientsByShop', auth.middleware, function(req, res){
  IngredientController.getAllIngredientsByShop(req, res);
})

router.post('/insertPromoHours', auth.middleware, function(req, res){
  PromoController.insertPromoHours(req, res);
})

router.post('/updatePromoHours', auth.middleware, function(req, res){
  PromoController.setPromoHours(req, res);
})

router.post('/deletePromoHours', auth.middleware, function(req, res){
  PromoController.deletePromoHours(req, res);
})

router.post('/validateIngredientName', auth.middleware, function(req, res){
  IngredientController.validateIngredientName(req, res);
})

router.post('/updateNewField', auth.middleware, function(req, res){
  ShopController.updateNewField(req, res);
})

router.post('/updatePromoPrice', auth.middleware, function(req, res){
  PromoController.setPromoPrice(req, res);
})

router.post('/deleteProduct', auth.middleware, function(req, res){
  ProductController.deleteProduct(req, res);
})

router.post('/deletePromo', auth.middleware, function(req, res){
  PromoController.deletePromo(req, res);
})

router.post('/deleteIngredient', auth.middleware, function(req, res){
  IngredientController.deleteIngredient(req, res);
})

router.post('/modifyProduct', auth.middleware, function(req, res){
  ProductController.modifyProduct(req, res);
})

router.post('/modifyIngredient', auth.middleware, function(req, res){
  IngredientController.modifyIngredient(req, res);
})

router.post('/modifyPromo', auth.middleware, function(req, res){
  PromoController.modifyPromo(req, res);
})

//MERCADO PAGO
router.get('/payments/checkout/:number/:mail/:total/:cuit', auth.middleware, async (req, res) => {
  PaymentController.makePayment(req, res);
})

router.get('/payments/success/:number/:mail/:total/:cuit', (req, res) => {
  PaymentController.insertPayment(req, res);
})

router.get('/payments/pending', (req, res) => {
  return res.render('pending_screen')
})

router.get('/payments/failure', (req, res) => {
  return res.render('failure_screen')
})

router.get('/payments/refund/:numero', auth.middleware, async (req, res) => {
  PaymentController.makeRefund(req, res);
})

module.exports = router;