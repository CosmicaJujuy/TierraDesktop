miAppHome.service('detalleNotaCreditoService', function ($http, $q, cookieService) {
    this.getNotaCreditoDetail = function (idNota) {
        var datosRecu = null;
        var deferred = $q.defer();
        var uri = 'https://tierradecoloresapi.herokuapp.com/notadetalle/nota';
        var token = cookieService.get('token');
        token.then(function (data) {
            $http({
                url: uri,
                method: 'get',
                params: {
                    'idNota': idNota
                },
                headers: {
                    'Authorization': 'Bearer ' + data,
                    'Content-type': 'application/json'
                }
            }).then(function successCallback(response) {
                datosRecu = response;
                deferred.resolve(datosRecu);
            }, function errorCallback(response) {
                datosRecu = response;
                deferred.resolve(datosRecu);
            });
        });
        return deferred.promise;
    };
});