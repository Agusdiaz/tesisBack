var conMysql = require('../mysqlConnection');

exports.createClientOrder = (order, callback) => {
    const sql = 'INSERT INTO pedido (cliente, local, total, etapa, takeAway, propina, comentario) VALUES ?';
    var values = [
        [order.mail, order.cuit, order.total, 'pendiente', order.takeAway, order.propina, order.comentario]
    ]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.createPendingOrder = (mail, cuit, num, callback) => {
    const sql = 'INSERT INTO pendiente (cliente, local, pedido) SELECT * FROM (SELECT ?, ?, ?) AS tmp WHERE NOT EXISTS (SELECT cliente, ' +
    'local, pedido FROM pendiente WHERE cliente = ? AND local = ? AND pedido = ?) LIMIT 1;';
    var values = [mail, cuit, num, mail, cuit, num]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.deletOrderByClient = (num, callback) => {
    const sql = 'DELETE FROM pedido WHERE numero = ?';
    conMysql.query(sql, [num], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.aceptOrder = (numero, callback) => {
    const sql = 'UPDATE pedido SET aceptado = ? WHERE numero = ?';
    var values = [1, numero]
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
    const sql = 'UPDATE pendiente SET local = ? WHERE pedido = ?;';
    var values = [null, order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateOrderReady = (order, callback) => {
    const sql = 'UPDATE pedido SET etapa = ?, fechaListo = ? WHERE numero = ?; SELECT cliente FROM pendiente WHERE pedido = ?';
    var fecha = new Date()
    var values = ['listo', fecha, order.numero, order.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.updateOrderPayed = (num, callback) => {
    var fecha = new Date()
    const sql = 'UPDATE pedido SET fecha = ?, pagado = ? WHERE numero = ?';
    var values = [fecha, 1, num]
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
    const sql = 'INSERT INTO pendiente (cliente, pedido) SELECT * FROM (SELECT ?, ?) AS tmp WHERE NOT EXISTS (SELECT cliente, pedido ' +
    'FROM pendiente WHERE cliente = ? AND pedido = ?) LIMIT 1;';
    var values = [body.mail, body.numero, body.mail, body.numero]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getClientPendingOrders = (client, callback) => {
    const sql = 'SELECT numero, nombre, direccion, etapa, propina, takeAway, total, TIMESTAMPDIFF(MINUTE,fecha,NOW()) AS tiempo, fecha, comentario, aceptado FROM pendiente INNER ' + 
    'JOIN pedido ON pendiente.pedido = pedido.numero INNER JOIN local ON pedido.local = local.cuit WHERE pendiente.cliente = ? AND etapa != ? ORDER BY etapa ASC, fecha DESC';
    var values = [client.mail, 'entregado']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getClientAllOrders = (client, callback) => {
    const sql = 'SELECT numero, nombre, direccion, etapa, takeAway, propina, total, fecha, comentario FROM pedido INNER JOIN local ON pedido.local = local.cuit WHERE ' +
    'pedido.cliente = ? AND pedido.etapa = ? ORDER BY fecha ASC';
    var values = [client.mail, 'entregado']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopDeliveredOrdersByArrival = (shop, callback) => {
    const sql = 'SELECT numero, cliente, etapa, takeAway, total, fecha, comentario FROM pedido WHERE local = ? AND etapa IN ? ORDER BY etapa DESC, fecha DESC';
    var values = [shop.cuit, [['listo', 'entregado']]]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopPendingOrdersByArrival = (shop, callback) => {
    const sql = 'SELECT numero, cliente, etapa, takeAway, (total + propina) AS total, TIMESTAMPDIFF(MINUTE,fecha,NOW()) AS tiempo, fecha, comentario, aceptado FROM pedido ' +
    'WHERE local = ? AND etapa = ? AND pagado = 1 ORDER BY aceptado ASC, fecha DESC';
    var values = [shop.cuit, 'pendiente']
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getShopPendingOrdersByProducts = (shop, callback) => {
    const sql = 'SELECT numero, cliente, etapa, takeAway, (total + propina) AS total, TIMESTAMPDIFF(MINUTE,fecha,NOW()) AS tiempo, fecha, comentario, SUM(cantidad) AS '+ 
    'cantProductos, aceptado FROM pedido INNER JOIN pedidoproducto ON pedido.numero = pedidoproducto.pedido WHERE local = ? AND etapa = ? AND pagado = 1 GROUP BY numero ORDER BY cantProductos DESC; ' +
    'SELECT numero, cliente, etapa, takeAway, (total + propina) AS total, TIMESTAMPDIFF(MINUTE,fecha,NOW()) AS tiempo, fecha, comentario, SUM(pedidopromocionproducto.cantidad) * MAX(pedidopromocion.cantidad) ' + 
    'AS cantProductos, aceptado FROM pedido INNER JOIN pedidopromocion ON pedido.numero = pedidopromocion.pedido INNER JOIN pedidopromocionproducto ON pedidopromocionproducto.pedidoPromocion ' +
    '= pedidopromocion.id WHERE local = ? AND etapa = ? AND pagado = 1 GROUP BY numero ORDER BY cantProductos DESC;'
    conMysql.query(sql, [shop.cuit, 'pendiente', shop.cuit, 'pendiente'], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);       
    });
}

exports.getTopRequestedProducts = (shop, callback) => {
    const sql = 'SELECT pedidoproducto.id, pedidoproducto.nombre, SUM(cantidad) AS cantidad FROM pedido INNER JOIN pedidoproducto ON pedido.numero = pedidoproducto.pedido WHERE local = ? AND pagado = 1 ' +
    'GROUP BY id ORDER BY cantidad DESC LIMIT 10; SELECT MIN(pedidopromocionproducto.id) as id, pedidopromocionproducto.nombre, SUM(pedidopromocionproducto.cantidad * pedidopromocion.cantidad) AS cantidad, "si" AS promo FROM pedido ' +
    'INNER JOIN pedidopromocion ON pedido.numero = pedidopromocion.pedido INNER JOIN pedidopromocionproducto ON pedidopromocionproducto.pedidoPromocion = pedidopromocion.id WHERE local = ? AND pagado = 1 GROUP BY nombre ORDER BY cantidad LIMIT 10;'
    conMysql.query(sql, [shop.cuit, shop.cuit], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getOrdersTopHours = (shop, day, callback) => {
    const sql = 'SELECT HOUR(fecha) AS hora, COUNT(*) AS cantidad FROM pedido WHERE local = ? AND weekday(fecha) = ? ' + 
    'AND pagado = 1 GROUP BY HOUR(fecha)';
    conMysql.query(sql, [shop.cuit, day], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getLast6MonthOrdersAmount = (shop, callback) => {
    const sql = 'SELECT MONTH(fecha) AS mes, COUNT(*) AS cantidad FROM pedido WHERE local = ? AND pagado = 1 AND fecha >= DATE_SUB(CURRENT_DATE(), ' +
    'INTERVAL 6 MONTH) GROUP BY mes ORDER BY mes;';
    conMysql.query(sql, shop.cuit, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}