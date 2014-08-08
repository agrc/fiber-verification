/* jshint maxlen:false */
define(['dojo/has'], function (has) {
    var apiKey;
    var ownerName;
    if (has('agrc-api-key') === 'prod') {
        // mapserv.utah.gov
        apiKey = 'AGRC-E7FEB434755864';
        ownerName = 'FIBERADMIN';
    } else if (has('agrc-api-key') === 'stage') {
        // test.mapserv.utah.gov
        apiKey = 'AGRC-FFCDAD6B933051';
        ownerName = 'FIBERADMIN';
    } else {
        // localhost
        apiKey = 'AGRC-B5D62BD2151902';
        ownerName = 'DBO';
    }
    var colors = {
        transparent: [0, 0, 0, 0],
        white: [0, 0, 0, 255],
        one: [92, 184, 92, 200],
        nine: [66, 139, 202, 200],
        gray: [255, 255, 255, 255]
    };
    var ServiceClass = 'ServiceClass';
    var baseService = '/arcgis/rest/services/FiberVerification/';
    var workspaceId = 'FiberVerification';
    var QualifiedServiceClass = workspaceId + '.' + ownerName + '.ServiceAreas.' + ServiceClass;

    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '0.1.3',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: apiKey, // acquire at developer.mapserv.utah.gov

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
            mapService: baseService + 'MapServer',
            featureService: baseService + 'FeatureServer'
        },

        workspaceId: workspaceId,
        ownerName: ownerName,

        fieldNames: {
            ProvName: 'ProvName',
            HexID: 'HexID',
            ServiceClass: ServiceClass
        },

        appName: 'fiberverification',

        renderers: {
            maxScaleForCoarse: 140000,
            fine: {
                type: 'uniqueValue',
                field1: QualifiedServiceClass,
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
                field1: QualifiedServiceClass,
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


    return window.AGRC;
});
