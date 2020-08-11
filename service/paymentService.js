var conMysql = require('../mysqlConnection');
var bcrypt = require('bcrypt');

exports.createPayment = (payment, callback) => {
    const sql = 'INSERT INTO pago (cliente, pedido, local, total, fecha, nroTarjeta, clave, medioPago) VALUES ?';
    let hashedKey = bcrypt.hashSync(payment.clave.toString(), process.env.BCRYPT_ROUNDS || 10)
    //var medioPago = (payment.medioPago != null) ? payment.medioPago : null
    var fecha = new Date();
    var values = [[payment.mail, payment.pedido, payment.cuit, payment.total, fecha, payment.nroTarjeta, hashedKey, payment.medioPago]]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}