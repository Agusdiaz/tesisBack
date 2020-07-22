var conMysql = require('../mysqlConnection');

exports.createClientOrder = (order, callback) => {
    const sql = 'INSERT INTO pedido (cliente, local, total, fecha, etapa, takeAway, propina) VALUES ?';
    var fecha = new Date()
    var values = [
        [order.mail, order.cuit, order.total, fecha, 'pendiente', order.takeAway, order.propina]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createPendingOrder = (mail, cuit, num, callback) => {
    const sql = 'INSERT INTO pendiente (cliente, local, pedido) VALUES ?';
    var values = [
        [mail, cuit, num]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deletOrderByClient = (order, callback) => {
    const sql = 'DELETE FROM pedido WHERE numero = ?';
    var values = [order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deleteOrderPendingByClient = (order, callback) => {
    const sql = 'DELETE FROM pendiente WHERE pedido = ?';
    var values = [order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateOrderDelivered = (order, callback) => {
    const sql = 'UPDATE pedido SET etapa = ? WHERE numero = ?';
    var values = ['entregado', order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deleteOrderPendingByShop = (order, callback) => {
    const sql = 'UPDATE pendiente SET local = ? WHERE pedido = ?';
    var values = [null, order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateOrderReady = (order, callback) => {
    const sql = 'UPDATE pedido SET etapa = ?, fechaListo = ? WHERE numero = ?';
    var fecha = new Date()
    var values = ['listo', fecha, order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.validateOrderClient = (body, callback) => {
    const sql = 'SELECT * FROM pendiente WHERE cliente = ? AND pedido = ?';
    var values = [body.mail, body.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err)
        else
            callback(null, result)
    })
}

exports.shareOrder = (body, callback) => {
    const sql = 'INSERT INTO pendiente (cliente, pedido) VALUES ?';
    var values = [[body.mail, body.numero]]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getClientPendingOrders = (client, callback) => {
    const sql = 'SELECT numero, nombre, etapa, propina, total, fecha FROM pendiente INNER JOIN pedido ON pendiente.pedido = pedido.numero ' + 
    'INNER JOIN local ON pedido.local = local.cuit WHERE pendiente.cliente = ?';
    var values = [client.mail]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getClientAllOrders = (client, callback) => {
    const sql = 'SELECT numero, nombre, etapa, propina, total, fecha FROM pedido INNER JOIN local ON pedido.local = local.cuit WHERE ' +
    'pedido.cliente = ? AND pedido.etapa = ?';
    var values = [client.mail, 'entregado']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopPendingOrdersByArrival = (shop, callback) => {
    const sql = 'SELECT numero, cliente, takeAway, total, fecha FROM pedido WHERE local = ? AND etapa = ? ORDER BY fecha ASC';
    var values = [shop.cuit, 'pendiente']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopPendingOrdersByProducts = (shop, callback) => {
    const sql = 'SELECT numero, cliente, takeAway, total, fecha, SUM(cantidad) as cantProductos FROM pedido INNER JOIN ' + 
    'pedidoproducto ON pedido.numero = pedidoproducto.pedido WHERE local = ? AND etapa = ? GROUP BY numero ORDER BY cantProductos DESC';
    var values = [shop.cuit, 'pendiente']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getTopRequestedProducts = (shop, callback) => {
    const sql = 'SELECT producto.id, nombre, SUM(cantidad) AS cantidad FROM pedidoproducto INNER JOIN pedido ON pedido = numero ' + 
    'INNER JOIN producto ON producto = producto.id WHERE pedido.local = ? GROUP BY producto ORDER BY cantidad DESC';
    conMysql.query(sql, shop.cuit, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getOrdersTopHours = (shop, callback) => {
    const sql = 'SELECT HOUR(fecha) AS hora, COUNT(*) AS cantidad FROM pedido WHERE local = ? GROUP BY hora ORDER BY fecha DESC';
    conMysql.query(sql, shop.cuit, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getLast6MonthOrdersAmount = (shop, callback) => {
    const sql = 'SELECT MONTH(fecha) AS mes, COUNT(*) AS cantidad FROM pedido WHERE local = ? AND fecha >= DATE_SUB(CURRENT_DATE(), ' +
    'INTERVAL 6 MONTH) GROUP BY mes ORDER BY mes;';
    conMysql.query(sql, shop.cuit, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}