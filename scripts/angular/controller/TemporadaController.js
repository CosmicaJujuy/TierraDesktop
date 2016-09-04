(function () {
    'use stricct';

    angular
            .module('tierraDeColoresApp')
            .controller('TemporadaController', TemporadaController);

    TemporadaController.$inject = ['$scope', '_temporadaService'];

    function TemporadaController($scope, _temporadaService) {
        var vm = this;
        vm.listaTemporadas = listaTemporadas;

        function listaTemporadas() {
            $scope.temporadas = "";
            _temporadaService
                    .getAll()
                    .then(function (datos) {
                        if (datos.status === 200) {
                            $scope.temporadas = datos.data;
                        }
                    });
        }

    }

})();