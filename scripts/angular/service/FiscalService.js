(function () {
    'use strict';
    angular
            .module('tierraDeColoresApp')
            .service('fiscalService', fiscalService);
    fiscalService.$inject = ['$q', '$http', 'cookieService', 'BaseURL', 'toaster', '$rootScope'];

    function fiscalService($q, $http, cookieService, BaseURL, toaster, $rootScope) {
        const exec = require('child_process').exec;
        const http = require('http');
        const fs = require('fs');
        const path = require('path');
        var parser = document.createElement('a');
        parser.href = BaseURL;
        var Auth = {
            'usuario': 'AFIP_SMH/P-441F',
            'password': 'T13RR4$7j15vker4L-L'
        };

        this.read = function () {
            var datosRecu = null;
            var deferred = $q.defer();
            var filePath = path.join(__dirname, 'FILE.ans');
            fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
                if (!err) {
                    datosRecu = data;
                    deferred.resolve(datosRecu);
                }
            });
            return deferred.promise;
        };

        function print(tipo) {
            exec('wspooler.exe -p4 -l -f FILE.200', function (err, stdout, stderr) {
                if (err !== null) {
                    console.log(err);
                    $rootScope.$broadcast("printState", {tipo: tipo, status: false});
                } else {
                    $rootScope.$broadcast("printState", {tipo: tipo, status: true});
                }
            });
        }

        this.cleanFiles = function () {
            fs.unlink('FILE.200', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('successfully deleted FILE.200');
            });
            fs.unlink('FILE.ans', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('successfully deleted FILE.ans');
            });
            return true;
        };

        this.factura_aOrFactura_b = function (factura, cliente, type) {
            var options = null;
            var token = cookieService.get('token');
            var tipo;
            token.then(function (data) {
                options = {
                    host: parser.hostname,
                    port: parser.port,
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + data
                    }
                };
                if (type === 0) {
                    options.path = '/fiscal/factura_a?factura=' + factura + "&cliente=" + cliente;
                    tipo = "Factura A";
                } else if (1) {
                    options.path = '/fiscal/factura_b?factura=' + factura + "&cliente=" + cliente;
                    tipo = "Factura B";
                }
                var files = fs.createWriteStream("FILE.200");
                var request = http.get(options, function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(files);
                        print(tipo);
                    }
                });
            });
        };

        this.ticketOrRegalo = function (factura, serial) {
            var token = cookieService.get('token');
            var type;
            token.then(function (data) {
                var options = {
                    host: parser.hostname,
                    port: parser.port,
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + data
                    }
                };
                if (serial !== null & typeof serial !== 'undefined') {
                    options.path = '/fiscal/regalo?factura=' + factura + "&serial=" + serial;
                    type = "Regalo";
                } else {
                    options.path = '/fiscal/ticket?factura=' + factura;
                }
                var files = fs.createWriteStream("FILE.200");
                var request = http.get(options, function (response) {
                    if (response.statusCode === 200) {
                        response.pipe(files);
                        print();
                    }
                });
            });
        };

        this.comprobanteZ = function () {
            var deferred = $q.defer();
            const exec = require('child_process').exec;
            exec('wspooler.exe -p4 -l -f compZ.200', (err, stdout, stderr) => {
                if (err !== null) {
                    deferred.resolve(false);
                    console.log(err);
                    console.log(stderr);
                    console.log(stdout);
                } else {
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        };

        this.isConnected = function () {
            var deferred = $q.defer();
            const exec = require('child_process').exec;
            exec('wspooler.exe -p4 -l -f CONNECTED.200', (err, stdout, stderr) => {
                if (err !== null) {
                    deferred.resolve(false);
                    console.log(err);
                    console.log(stderr);
                    console.log(stdout);
                } else {
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        };

    }
})();