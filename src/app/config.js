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

        // version.: String
        //      The version number.
        version: '0.1.1',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: null, // acquire at developer.mapserv.utah.gov

        user: null, // to be populated after successful sign in

        topics: {
            map: {
                enableLayer: 'app.addLayer',
                click: 'app.map.click',
                featuresSelected: 'app.map.featuresSelected',
                clearSelection: 'app.map.clearSelection',
                selectedFeatureClicked: 'app.map.selectedFeatureClicked',
                refreshProvider: 'app.map.refreshProvider'

            },
            selectionTools: {
                activateTool: 'app.selectionTools.activateTool'
            }
        },

        layerIds: {
            selection: 'selection-layer',
            provider: 'provider-layer'
        },

        urls: {
            search: 'http://api.mapserv.utah.gov/api/v1/search/{0}/{1}',
            vector: 'http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Vector/MapServer',
            mapService: '/arcgis/rest/services/FiberVerification/MapServer',
            editApi: '/fiberverificationapi/edit'
        },

        query:
            'SELECT h.HexID, h.OBJECTID, h.SHAPE, psa.ProvName, psa.ServiceClass ' +
            'FROM FiberVerification.${ownerName}.HEXAGONS as h ' +
            'INNER JOIN ( ' +
                'SELECT HexID, ProvName, ServiceClass from FiberVerification.${ownerName}.SERVICEAREAS ' +
                'WHERE ProvName = \'${provName}\' ' +
                ') as psa ' +
            'ON psa.HexID = h.HexID',

        workspaceId: 'FiberVerification',

        fieldNames: {
            ProvName: 'ProvName',
            HexID: 'HexID',
            Code: 'Code'
        },

        appName: 'fiberverification',

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
                }, {
                    symbol: {
                        type: 'esriSFS',
                        style: 'esriSFSNull',
                        color: [0, 0, 0, 255]
                    },
                    value: '0',
                    label: '0',
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
                }, {
                    symbol: {
                        type: 'esriSFS',
                        style: 'esriSFSNull',
                        color: [0, 0, 0, 255]
                    },
                    value: '0',
                    label: '0',
                    description: ''
                }]
            }
        }
    };

    if (has('agrc-api-key') === 'prod') {
        // mapserv.utah.gov
        window.AGRC.apiKey = 'AGRC-E7FEB434755864';
        window.AGRC.ownerName = 'FIBERADMIN';
    } else if (has('agrc-api-key') === 'stage') {
        // test.mapserv.utah.gov
        window.AGRC.apiKey = 'AGRC-FFCDAD6B933051';
        window.AGRC.ownerName = 'FIBERADMIN';
    } else {
        // localhost
        window.AGRC.apiKey = 'AGRC-B5D62BD2151902';
        window.AGRC.ownerName = 'DBO';
    }

    return window.AGRC;
});
