var conMysql = require('../mysqlConnection');
var bcrypt = require('bcrypt');

exports.createPayment = (number, mail, total, cuit, idPago, callback) => {
    const sql = 'INSERT INTO pago (cliente, pedido, local, total, fecha, idPago) VALUES ?';
    var fecha = new Date();
    var values = [[mail, number, cuit, total, fecha, idPago]]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}

exports.getPaymentId = (number, callback) => {
    const sql = 'SELECT idPago FROM pago INNER JOIN pedido ON pago.pedido = pedido.numero WHERE pago.pedido = ?';
    conMysql.query(sql, [number], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}