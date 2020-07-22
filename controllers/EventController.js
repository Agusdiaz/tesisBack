const ShopService = require('../service/shopService');

exports.checkAllShopsSchedules = () => {
    console.log('entre')
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

function asyncSchedules(cuit, abierto) {
    ShopService.checkSchedules(cuit, (error, result) => {
        if (error) {
            console.log(error)
            console.log('Error al chequear horario del local')
        }
        else {
            var estado = (result.length > 0) ? 1 : 0
            if (abierto != estado) {
                ShopService.updateOpenCloseShop(estado, cuit, (error, result) =>{
                    if (error) {
                        console.log(error)
                        console.log('Error al actualizar abierto/cerrado del local')
                    }
                    else
                        console.log('Se actualizó el local cuit='+ cuit +' a abierto='+ estado)
                })
            }
        }
    })
}