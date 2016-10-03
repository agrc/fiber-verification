require([
    'app/MapController',
    'app/config',

    'dojo/dom-construct'

], function (
    MapController,
    config,

    domConstruct
    ) {
    var selectedFeatures = [{
        'geometry': {
            'rings': [
                [
                    [244208.4299999997, 4109899.34],
                    [243708.4299999997, 4109899.34],
                    [243458.4299999997, 4110332.3599999994],
                    [243708.4299999997, 4110765.369999999],
                    [244208.4299999997, 4110765.369999999],
                    [244458.4299999997, 4110332.3599999994],
                    [244208.4299999997, 4109899.34]
                ]
            ],
            'spatialReference': {
                'wkid': 26912,
                'latestWkid': 26912
            }
        },
        'attributes': {
            'HexID': 11712,
            'OBJECTID': 10749
        },
        'symbol': {
            'color': [85, 85, 85, 77],
            'outline': {
                'color': [240, 18, 190, 255],
                'width': 2.25,
                'type': 'esriCLS',
                'style': 'esriSLSSolid',
                'cap': 'esriLCSRound',
                'join': 'esriLJSRound'
            },
            'type': 'esriSFS',
            'style': 'esriSFSSolid'
        }
    }, {
        'geometry': {
            'rings': [
                [
                    [241958.4299999997, 4110332.3599999994],
                    [241458.4299999997, 4110332.3599999994],
                    [241208.4299999997, 4110765.369999999],
                    [241458.4299999997, 4111198.3900000006],
                    [241958.4299999997, 4111198.3900000006],
                    [242208.4299999997, 4110765.369999999],
                    [241958.4299999997, 4110332.3599999994]
                ]
            ],
            'spatialReference': {
                'wkid': 26912,
                'latestWkid': 26912
            }
        },
        'attributes': {
            'HexID': 111,
            'OBJECTID': 10750
        },
        'symbol': {
            'color': [85, 85, 85, 77],
            'outline': {
                'color': [240, 18, 190, 255],
                'width': 2.25,
                'type': 'esriCLS',
                'style': 'esriSLSSolid',
                'cap': 'esriLCSRound',
                'join': 'esriLJSRound'
            },
            'type': 'esriSFS',
            'style': 'esriSFSSolid'
        }
    }, {
        'geometry': {
            'rings': [
                [
                    [241958.4299999997, 4110332.3599999994],
                    [241458.4299999997, 4110332.3599999994],
                    [241208.4299999997, 4110765.369999999],
                    [241458.4299999997, 4111198.3900000006],
                    [241958.4299999997, 4111198.3900000006],
                    [242208.4299999997, 4110765.369999999],
                    [241958.4299999997, 4110332.3599999994]
                ]
            ],
            'spatialReference': {
                'wkid': 26912,
                'latestWkid': 26912
            }
        },
        'attributes': {
            'HexID': 12011,
            'OBJECTID': 10750
        },
        'symbol': {
            'color': [85, 85, 85, 77],
            'outline': {
                'color': [240, 18, 190, 255],
                'width': 2.25,
                'type': 'esriCLS',
                'style': 'esriSLSSolid',
                'cap': 'esriLCSRound',
                'join': 'esriLJSRound'
            },
            'type': 'esriSFS',
            'style': 'esriSFSSolid'
        }
    }];
    var providerFeatures = [{
        'geometry': {
            'rings': [
                [
                    [244208.4299999997, 4109899.34],
                    [243708.4299999997, 4109899.34],
                    [243458.4299999997, 4110332.3599999994],
                    [243708.4299999997, 4110765.369999999],
                    [244208.4299999997, 4110765.369999999],
                    [244458.4299999997, 4110332.3599999994],
                    [244208.4299999997, 4109899.34]
                ]
            ],
            'spatialReference': {
                'wkid': 26912,
                'latestWkid': 26912
            }
        },
        'attributes': {
            'FiberVerification.DBO.Hexagons.OBJECTID': 76821,
            'FiberVerification.DBO.ProviderServiceAreas.HexID': 11712,
            'FiberVerification.DBO.ProviderServiceAreas.ServiceClass': 9
        },
        'symbol': {
            'color': [85, 85, 85, 77],
            'outline': {
                'color': [240, 18, 190, 255],
                'width': 2.25,
                'type': 'esriCLS',
                'style': 'esriSLSSolid',
                'cap': 'esriLCSRound',
                'join': 'esriLJSRound'
            },
            'type': 'esriSFS',
            'style': 'esriSFSSolid'
        }
    }, {
        'geometry': {
            'rings': [
                [
                    [241958.4299999997, 4110332.3599999994],
                    [241458.4299999997, 4110332.3599999994],
                    [241208.4299999997, 4110765.369999999],
                    [241458.4299999997, 4111198.3900000006],
                    [241958.4299999997, 4111198.3900000006],
                    [242208.4299999997, 4110765.369999999],
                    [241958.4299999997, 4110332.3599999994]
                ]
            ],
            'spatialReference': {
                'wkid': 26912,
                'latestWkid': 26912
            }
        },
        'attributes': {
            'FiberVerification.DBO.Hexagons.OBJECTID': 76821,
            'FiberVerification.DBO.ProviderServiceAreas.HexID': 12011,
            'FiberVerification.DBO.ProviderServiceAreas.ServiceClass': 9
        },
        'symbol': {
            'color': [85, 85, 85, 77],
            'outline': {
                'color': [240, 18, 190, 255],
                'width': 2.25,
                'type': 'esriCLS',
                'style': 'esriSLSSolid',
                'cap': 'esriLCSRound',
                'join': 'esriLJSRound'
            },
            'type': 'esriSFS',
            'style': 'esriSFSSolid'
        }
    }];
    describe('app/MapController', function () {
        beforeEach(function () {
            MapController.init({mapDiv: domConstruct.create('div', null, document.body)});
        });
        afterEach(function () {
            MapController.destroy();
        });

        describe('onMapClick', function () {
            it('calls selectFeatures if no draw tool is active', function () {
                spyOn(MapController, 'selectFeatures');
                var mapPoint = {};
                MapController.activateTool('POLYGON');

                MapController.onMapClick({mapPoint: mapPoint});

                expect(MapController.selectFeatures).not.toHaveBeenCalled();

                MapController.activateTool('none');

                MapController.onMapClick({mapPoint: mapPoint});

                expect(MapController.selectFeatures).toHaveBeenCalledWith(mapPoint);
            });
        });

        describe('getHoneyComb', function () {
            it('returns adds and updates', function () {
                MapController.selectedFeatures = selectedFeatures;
                MapController.providerLayer = {
                    graphics: providerFeatures
                };
                config.user = {agency: 'blah'};

                var comb = MapController.getHoneyComb();

                expect(comb.updates.length).toBe(0);
                expect(comb.adds.length).toBe(3);
            });
        });
    });
});
