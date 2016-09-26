(function () {
    'use strict';

    angular
            .module('tierraDeColoresApp')
            .config(colorConfig);

    colorConfig.$inject = ['colorConfProvider', '$mdThemingProvider'];

    function colorConfig(colorConfProvider, $mdThemingProvider) {

        $mdThemingProvider.definePalette('deprecated', {
            '50': 'ffffff',
            '100': 'ffffff',
            '200': '0099cb', // sombra menu
            '300': 'ffffff',
            '400': 'ffffff',
            '500': 'ffffff', // fondo desplegable
            '600': 'ffffff',
            '700': 'ffffff', // fondo tooltip
            '800': 'ffffff',
            '900': '002300', // letras boton
            'A100': '00bffe', // color menu desplegable
            'A200': 'ffffff', // letras
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'dark'
        });
        $mdThemingProvider.definePalette('headerPalette', {
            '50': 'b0cb1f',
            '100': 'b0cb1f',
            '200': '8dc242', //
            '300': 'b0cb1f',
            '400': 'b0cb1f',
            '500': '0099cb', //
            '600': 'b0cb1f',
            '700': '717171',
            '800': 'b0cb1f',
            '900': 'ffffff',
            'A100': 'b0cb1f',
            'A200': 'ffffff',
            'A400': 'b0cb1f',
            'A700': 'b0cb1f',
            'contrastDefaultColor': 'light'
        });

        $mdThemingProvider.definePalette('dorado', {
            '50': 'fdd303',
            '100': 'fdd303',
            '200': 'fdd303',
            '300': 'fdd303',
            '400': 'fdd303',
            '500': 'fdd303',
            '600': 'fdd303',
            '700': '717171',
            '800': 'fdd303',
            '900': 'ffffff',
            'A100': 'fdd303',
            'A200': 'fdd303',
            'A400': 'fdd303',
            'A700': 'fdd303',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('naranja', {
            '50': 'f6a20b',
            '100': 'f6a20b',
            '200': 'f8ad09',
            '300': 'f6a20b',
            '400': 'f6a20b',
            '500': 'ffd600',
            '600': 'f6a20b',
            '700': '717171',
            '800': 'f6a20b',
            '900': 'ffffff',
            'A100': 'f6a20b',
            'A200': 'f6a20b',
            'A400': 'f6a20b',
            'A700': 'f6a20b',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('miel', {
            '50': 'ff7f00',
            '100': 'ff7f00',
            '200': 'fe8902',
            '300': 'ff7f00',
            '400': 'ff7f00',
            '500': 'fbb10a',
            '600': 'ff7f00',
            '700': '717171',
            '800': 'ff7f00',
            '900': 'ffffff',
            'A100': 'ff7f00',
            'A200': 'ff7f00',
            'A400': 'ff7f00',
            'A700': 'ff7f00',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('verde', {
            '50': 'b0cb1f',
            '100': 'b0cb1f',
            '200': 'b0cb1f',
            '300': 'b0cb1f',
            '400': 'b0cb1f',
            '500': 'b0cb1f',
            '600': 'b0cb1f',
            '700': '717171',
            '800': 'b0cb1f',
            '900': 'ffffff',
            'A100': 'b0cb1f',
            'A200': 'b0cb1f',
            'A400': 'b0cb1f',
            'A700': 'b0cb1f',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('celeste', {
            '50': '00bffe',
            '100': '00bffe',
            '200': '0099cb', //
            '300': '00bffe',
            '400': '00bffe',
            '500': '0099cb', //
            '600': '00bffe',
            '700': '717171',
            '800': '00bffe',
            '900': 'ffffff',
            'A100': '00bffe',
            'A200': '00bffe',
            'A400': '00bffe',
            'A700': '00bffe',
            'contrastDefaultColor': 'light'
        });



        $mdThemingProvider.theme('header')
                .primaryPalette('headerPalette')
                .warnPalette('headerPalette')
                .accentPalette('headerPalette')
                .backgroundPalette('headerPalette');

        $mdThemingProvider.theme('modal')
                .primaryPalette(colorConfProvider.colorPalette().primaryModal)
                .warnPalette(colorConfProvider.colorPalette().warnModal)
                .accentPalette(colorConfProvider.colorPalette().accentModal)
                .backgroundPalette(colorConfProvider.colorPalette().backgroundModal)
                .dark(colorConfProvider.colorPalette().dark);


        $mdThemingProvider.theme('docs-dark')
                .primaryPalette(colorConfProvider.colorPalette().primaryPalette)
                .warnPalette(colorConfProvider.colorPalette().warnPalette)
                .accentPalette(colorConfProvider.colorPalette().accentPalette)
                .backgroundPalette(colorConfProvider.colorPalette().backgroundPalette)
                .dark(colorConfProvider.colorPalette().dark);
    }

})();
