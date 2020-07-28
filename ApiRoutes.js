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

router.post('/getShopMenu', function(req, res){
  ProductController.getShopMenu(req, res);
})

router.post('/getShopPromos', function(req, res){
  PromoController.getShopPromos(req, res);
})

//PARA CLIENTE
router.post('/insertClient', function(req, res){
  ClientController.insertClient(req, res);
})

router.post('/updateClient', function(req, res){
  ClientController.setClient(req, res);
})

router.post('/getFavourites', function(req, res){
  ShopController.getClientFavourites(req, res);
})

router.post('/setShopAsFavourite', function(req, res){
  ShopController.setShopAsFavourite(req, res);
})

router.post('/deleteShopAsFavourite', function(req, res){
  ShopController.deleteShopAsFavourite(req, res);
})

router.post('/getShopByName', function(req, res){
  ShopController.getShopByName(req, res);
})

router.post('/getShopByAddress', function(req, res){
  ShopController.getShopByAddress(req, res);
})

router.get('/getShopByPromo', function(req, res){
  ShopController.getShopsByPromos(req, res);
})

router.get('/getAllShopsOpenClose', function(req, res){
  ShopController.getAllShopsOpenClose(req, res);
})

router.get('/getAllShopsAZ', function(req, res){
  ShopController.getAllShopsAZ(req, res);
})

router.post('/setOrderDeliveredByClient', function(req, res){
  OrderController.setOrderDeliveredByClient(req, res);
})

router.post('/shareOrder', function(req, res){
  OrderController.shareOrder(req, res);
})

router.post('/insertPayment', function(req, res){
  PaymentController.insertPayment(req, res);
})

router.post('/getPendingOrdersByClient', function(req, res){
  OrderController.getClientPendingOrders(req, res);
})

router.post('/getAllOrdersByClient', function(req, res){
  OrderController.getClientAllOrders(req, res);
})

router.post('/insertClientOrder', function(req, res){
  OrderController.insertClientOrder(req, res);
})


//PARA LOCAL
router.post('/setOrderReadyByShop', function(req, res){
  OrderController.setOrderReadyByShop(req, res);
})

router.post('/getAllDisabledByShop', function(req, res){
  ProductController.getAllDisabledByShop(req, res);
})

router.post('/updateIngredientStatus', function(req, res){
  IngredientController.setIngredientStatus(req, res);
})

router.post('/updateProductStatus', function(req, res){
  ProductController.setProductStatus(req, res);
})

router.post('/updateShopFeatures', function(req, res){
  ShopController.setShopFeatures(req, res);
})

router.post('/updateShopSchedule', function(req, res){
  ShopController.setShopSchedule(req, res);
})

router.post('/deleteShopSchedule', function(req, res){
  ShopController.deleteShopSchedule(req, res);
})

router.post('/updateShopDelay', function(req, res){
  ShopController.setShopDelay(req, res);
})

router.post('/insertShopSchedule', function(req, res){
  ShopController.insertShopSchedule(req, res);
})

router.post('/getPendingOrdersInOrderByShop', function(req, res){
  OrderController.getShopPendingOrdersByArrival(req, res);
})

router.post('/getPendingOrdersMoreProductsByShop', function(req, res){
  OrderController.getShopPendingOrdersByProducts(req, res);
})

router.post('/insertShop', function(req, res){
  ShopController.insertShop(req, res);
})

router.post('/getTop10RequestedProductsByShop', function(req, res){
  ShopController.getTop10RequestedProductsByShop(req, res);
})

router.post('/getTopRequestedHoursByShop', function(req, res){
  ShopController.getTopRequestedHoursByShop(req, res);
})

router.post('/getLast6MonthOrdersByShop', function(req, res){
  ShopController.getLast6MonthOrdersByShop(req, res);
})

router.post('/insertProductWithIngredients', function(req, res){
  ProductController.insertProductWithIngredients(req, res);
})

router.post('/insertPromoWithProducts', function(req, res){
  PromoController.insertPromoWithProducts(req, res);
})

router.post('/getAllIngredientsByShop', function(req, res){
  IngredientController.getAllIngredientsByShop(req, res);
})

router.post('/insertPromoHours', function(req, res){
  PromoController.insertPromoHours(req, res);
})

router.post('/updatePromoHours', function(req, res){
  PromoController.setPromoHours(req, res);
})

router.post('/deletePromoHours', function(req, res){
  PromoController.deletePromoHours(req, res);
})

module.exports = router;