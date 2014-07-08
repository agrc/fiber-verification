/* jshint maxlen:false */
define(['dojo/has'], function (has) {
    var colors = {
        transparent: [0, 0, 0, 0],
        white: [0, 0, 0, 255],
        one: [92, 184, 92, 200],
        nine: [66, 139, 202, 200],
        gray: [255, 255, 255, 255]
    };
    var ServiceClass = 'ServiceClass';

    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version: String
        //      The version number.
        version: '0.1.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: '', // acquire at developer.mapserv.utah.gov

        user: null, // to be populated after successful sign in

        topics: {
            map: {
                enableLayer: 'app.addLayer'
            },
            selectionTools: {
                activateTool: 'app.selectionTools.activateTool'
            }
        },

        layerIds: {
            selection: 'selection-layer'
        },

        urls: {
            search: 'http://api.mapserv.utah.gov/api/v1/search/{0}/{1}',
            vector: 'http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Vector/MapServer',
            mapService: '/arcgis/rest/services/FiberVerification/MapServer'
        },

        query:
            'SELECT h.HexID, h.OBJECTID, h.SHAPE, psa.ProvName, psa.ServiceClass ' +
            'FROM FiberVerification.${ownerName}.HEXAGONS as h ' +
            'INNER JOIN ( ' +
                'SELECT HexID, ProvName, ServiceClass from FiberVerification.${ownerName}.PROVIDERSERVICEAREAS ' +
                'WHERE ProvName = \'${provName}\' ' +
                ') as psa ' +
            'ON psa.HexID = h.HexID',

        workspaceId: 'FiberVerification',

        fieldNames: {
            ProvName: 'ProvName'
        },

        appName: 'fiberVerification',

        renderers: {
            maxScaleForCoarse: 140000,
            fine: {
                type: 'uniqueValue',
                field1: ServiceClass,
                field2: null,
                field3: null,
                fieldDelimiter: ', ',
                defaultSymbol: {
                    type: 'esriSFS',
                    style: 'esriSFSSolid',
                    color: colors.transparent,
                    outline: {
                        type: 'esriSLS',
                        style: 'esriSLSSolid',
                        color: colors.white,
                        width: 0.4
                    }
                },
                defaultLabel: '<all other values>',
                uniqueValueInfos: [{
                    symbol: {
                        type: 'esriSFS',
                        style: 'esriSFSSolid',
                        color: colors.one,
                        outline: {
                            type: 'esriSLS',
                            style: 'esriSLSSolid',
                            color: colors.gray,
                            width: 0.4
                        }
                    },
                    value: '1',
                    label: '1',
                    description: ''
                }, {
                    symbol: {
                        type: 'esriSFS',
                        style: 'esriSFSSolid',
                        color: colors.nine,
                        outline: {
                            type: 'esriSLS',
                            style: 'esriSLSSolid',
                            color: colors.gray,
                            width: 0.4
                        }
                    },
                    value: '9',
                    label: '9',
                    description: ''
                }]
            },
            coarse: {
                type: 'uniqueValue',
                field1: ServiceClass,
                field2: null,
                field3: null,
                fieldDelimiter: ', ',
                defaultSymbol: {
                    type: 'esriSFS',
                    style: 'esriSFSSolid',
                    color: colors.transparent,
                    outline: {
                        type: 'esriSLS',
                        style: 'esriSLSSolid',
                        color: colors.white,
                        width: 0.4
                    }
                },
                defaultLabel: '<all other values>',
                uniqueValueInfos: [{
                    symbol: {
                        type: 'esriSFS',
                        style: 'esriSFSSolid',
                        color: colors.one,
                        outline: {
                            type: 'esriSLS',
                            style: 'esriSLSSolid',
                            color: colors.one,
                            width: 0.4
                        }
                    },
                    value: '1',
                    label: '1',
                    description: ''
                }, {
                    symbol: {
                        type: 'esriSFS',
                        style: 'esriSFSSolid',
                        color: colors.nine,
                        outline: {
                            type: 'esriSLS',
                            style: 'esriSLSSolid',
                            color: colors.nine,
                            width: 0.4
                        }
                    },
                    value: '9',
                    label: '9',
                    description: ''
                }]
            }
        }
    };

    if (has('agrc-api-key') === 'prod') {
        // mapserv.utah.gov
        window.AGRC.apiKey = 'AGRC-A94B063C533889';
        window.AGRC.ownerName = 'FiberAdmin';
    } else if (has('agrc-api-key') === 'stage') {
        // test.mapserv.utah.gov
        window.AGRC.apiKey = 'AGRC-AC122FA9671436';
        window.AGRC.ownerName = 'FiberAdmin';
    } else {
        // localhost
        window.AGRC.apiKey = 'AGRC-63E1FF17767822';
        window.AGRC.ownerName = 'DBO';
    }

    return window.AGRC;
});