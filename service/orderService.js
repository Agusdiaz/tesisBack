var conMysql = require('../mysqlConnection');

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
    const sql = 'UPDATE pedido SET etapa = ? WHERE numero = ?';
    var values = ['listo', order.numero]
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

exports.getProductOrders = (orderNum, callback) => {
    const sql = 'SELECT nombre, precio, cantidad FROM pedidoproducto INNER JOIN producto ON pedidoproducto.producto = producto.id ' + 
    'WHERE pedidoproducto.pedido = ?';
    var values = [orderNum]
    conMysql.query(sql, values, (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}