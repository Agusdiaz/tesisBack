const ShopService = require('../service/shopService');
const PromoService = require('../service/promoService');
const cron = require('node-cron');

cron.schedule('* * * * *', checkAllShopsSchedules) //Cada 1 minuto - Cada 5 segs "*/10 * * * * *"
cron.schedule('* * * * *', checkAllPromosHours)

function checkAllShopsSchedules() {
    console.log('Chequeo horarios de los locales')
    ShopService.getAllShopsOpenClose((error, result) => {
        if (error) {
            console.log(error)
            console.log('Error al traer todos los locales')
        }
        else if (result.length > 0) {
            result.map(obj => {
                asyncSchedules(obj.cuit, obj.abierto)
            })
        }
    })
}

function checkAllPromosHours() {
    console.log('Chequeo horarios de las promociones')
    PromoService.getAllPromos((error, result) => {
        if (error) {
            console.log(error)
            console.log('Error al traer todas las promociones')
        }
        else if (result.length > 0) {
            result.map(obj => {
                asyncHours(obj.id, obj.valida)
            })
        }
    })
}

function asyncSchedules(cuit, abierto, callback) {
    ShopService.checkSchedules(cuit, (error, result) => {
        if (error) {
            console.log(error)
            callback('Error al chequear horario del local')
        }
        else {
            var estado = (result.length > 0) ? 1 : 0
            //console.log('abierto   ', abierto, '    estado   ', estado)
            if (abierto != estado) {
                ShopService.updateOpenCloseShop(estado, cuit, (error, result) => {
                    if (error) {
                        console.log(error)
                        console.log('Error al actualizar abierto/cerrado del local')
                    }
                    else
                        console.log('Se actualizó el local cuit=' + cuit + ' a abierto=' + estado)
                })
            }
        }
    })
}

function asyncHours(idPromo, valida, callback) {
    PromoService.checkHours(idPromo, (error, result) => {
        if (error) {
            console.log(error)
            callback('Error al chequear horario de la promoción')
        }
        else {
            var estado = (result.length > 0) ? 1 : 0
            //console.log('valida   ', valida, '    estado   ', estado)
            if (valida != estado) {
                PromoService.updateValidPromo(estado, idPromo, (error, result) => {
                    if (error) {
                        console.log(error)
                        console.log('Error al actualizar valida de la promoción')
                    }
                    else
                        console.log('Se actualizó la promoción id=' + idPromo + ' a valida=' + estado)
                })
            }
        }
    })
}

exports.checkAllShopsSchedules = checkAllShopsSchedules
exports.checkAllPromosHours = checkAllPromosHours