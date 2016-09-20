(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp.printer')
            .controller('PrinterController', PrinterController);

    PrinterController.$inject = ['$timeout', '$window', '$stateParams'];

    function PrinterController($timeout, $window, $stateParams) {
        var vm = this;
        vm.talla = $stateParams.talla;
        vm.codigo = $stateParams.codigo;
        vm.descripcion = $stateParams.descripcion;
        $timeout(function timer() {
            $window.print();
        }, 1500);
    }

})();