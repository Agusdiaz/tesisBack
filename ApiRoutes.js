const router = require('express').Router();
const ClientController = require('./controllers/ClientController');
const ShopController = require('./controllers/ShopController');
const OrderController = require('./controllers/OrderController');
const ProductController = require('./controllers/ProductController');
const IngredientController = require('./controllers/IngredientController');
const PaymentController = require('./controllers/PaymentController');

router.get('/', function(req, res) {
  res.json(
      {
        status: 'API Its Working',
        message: 'Welcome',
      });
});

router.post('/login', function(req, res){
  ClientController.loginUser(req, res);
})

router.post('/insertClient', function(req, res){
  ClientController.insertClient(req, res);
});

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

router.get('/getAllShopsOpenClose', function(req, res){ //VER CUANDO ESTA ABIERTO/CERRADO
  ShopController.getAllShopsOpenClose(req, res);
})

router.get('/getAllShopsAZ', function(req, res){
  ShopController.getAllShopsAZ(req, res);
})

router.post('/setOrderDeliveredByClient', function(req, res){
  OrderController.setOrderDeliveredByClient(req, res);
})

router.post('/setOrderReadyByShop', function(req, res){
  OrderController.setOrderReadyByShop(req, res);
})

router.post('/shareOrder', function(req, res){
  OrderController.shareOrder(req, res);
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

router.post('/insertPayment', function(req, res){
  PaymentController.insertPayment(req, res);
})

router.post('/updateShop', function(req, res){
  ShopController.setShop(req, res);
})

router.post('/updateShopDelay', function(req, res){
  ShopController.setShopDelay(req, res);
})

router.post('/getPendingOrdersByClient', function(req, res){
  OrderController.getClientPendingOrders(req, res);
})

router.post('/getAllOrdersByClient', function(req, res){
  OrderController.getClientAllOrders(req, res);
})

router.post('/getPendingOrdersInOrderByShop', function(req, res){
  OrderController.getShopPendingOrdersByArrival(req, res);
})

router.post('/getPendingOrdersMoreProductsByShop', function(req, res){
  OrderController.getShopPendingOrdersByProducts(req, res);
})

router.post('/getShopMenu', function(req, res){
  ProductController.getShopMenu(req, res);
})

router.post('/insertClientOrder', function(req, res){
  OrderController.insertClientOrder(req, res);
})

module.exports = router;