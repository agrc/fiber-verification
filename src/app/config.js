/* jshint maxlen:false */
define([
    'dojo/has',

    'esri/config'
], function (
    has,

    esriConfig
) {
    var ownerName = 'FIBERADMIN';
    var colors = {
        transparent: [0, 0, 0, 0],
        white: [0, 0, 0, 255],
        one: [92, 184, 92, 200],
        nine: [66, 139, 202, 200],
        gray: [255, 255, 255, 255]
    };
    var ServiceClass = 'ServiceClass';
    var HexID = 'HexID';
    var loc = window.location; // required so that LoginRegister matches the correct urls
    var baseService = loc.protocol + '//' + loc.hostname + '/arcgis/rest/services/FiberVerification/';
    var workspaceId = 'FiberVerification';
    var QualifiedServiceClass = workspaceId + '.' + ownerName + '.ProviderServiceAreas.' + ServiceClass;
    var QualifiedHexID = workspaceId + '.' + ownerName + '.ProviderServiceAreas.' + HexID;
    var QualifiedServiceAreasOBJECTID = workspaceId + '.' + ownerName + '.ProviderServiceAreas.OBJECTID';

    // force api to use CORS on mapserv thus removing the test request on app load
    // e.g. http://mapserv.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.defaults.io.corsEnabledServers.push('mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('discover.agrc.utah.gov');

    var config = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '1.1.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        apiKey: null, // acquire at developer.mapserv.utah.gov

        quadWord: null,

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
            applyEdits: baseService + 'FeatureServer/1/applyEdits',
            securedServicesBaseUrl: baseService
        },

        workspaceId: workspaceId,
        ownerName: ownerName,

        fieldNames: {
            ProvName: 'ProvName',
            HexID: HexID,
            ServiceClass: ServiceClass,
            QualifiedServiceClass: QualifiedServiceClass,
            QualifiedHexID: QualifiedHexID,
            QualifiedServiceAreasOBJECTID: QualifiedServiceAreasOBJECTID
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

    if (has('agrc-api-key') === 'prod') {
        // fiberediting.mapserv.utah.gov
        config.apiKey = 'AGRC-B8627CDB199733';
        config.quadWord = 'kayak-cantina-freddie-cover';
    } else if (has('agrc-api-key') === 'stage') {
        // test.mapserv.utah.gov
        config.apiKey = 'AGRC-FFCDAD6B933051';
        config.quadWord = 'opera-event-little-pinball';
    } else {
        try {
            require(['dojo/text!src/secrets.json'], function (secretsJSON) {
                var secrets = JSON.parse(secretsJSON);
                config.quadWord = secrets.quadWord;
                config.apiKey = secrets.apiKey;
            });
        } catch (error) {
            // swallow
        }
    }

    return config;
});
