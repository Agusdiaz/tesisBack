var conMysql = require('../mysqlConnection');

exports.createPayment = (payment, callback) => {
    const sql = 'INSERT INTO pago (cliente, local, total, fecha, nroTarjeta, medioPago) VALUES ?';
    var medioPago = (payment.medioPago != null) ? payment.medioPago : null
    var fecha = new Date();
    var values = [[payment.mail, payment.cuit, payment.total, fecha, payment.nroTarjeta, medioPago]]
    conMysql.query(sql, [values], (err, result) => {
        if (err)
            callback(err);
        else
            callback(null, result);
    });
}