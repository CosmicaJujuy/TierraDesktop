(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .controller('SexoController', SexoController);
    SexoController.$inject = ['$scope', '_sexoService'];
    function SexoController($scope, _sexoService) {
        var vm = this;
        vm.listaSexos = listaSexos;

        function listaSexos() {
            $scope.sexos = "";
            _sexoService
                    .getAll()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.sexos = datos.data;
                        }
                    });
        }

    }

})();
