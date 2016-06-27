miAppHome.controller('DetalleNotaCreditoController', function ($scope, $state, $stateParams, detalleNotaCreditoService){
    
    $scope.listaDetalleNotaCredito = function (){
        var idNota = $stateParams.idNota;
        $list = detalleNotaCreditoService.getNotaCreditoDetail(idNota);
        $list.then(function (datos){
            console.log(datos);
            if(datos.status===200){
                
            }
        });
    };
    
});