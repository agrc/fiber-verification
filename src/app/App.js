define([
    'dojo/text!app/templates/App.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/string',

    'dojo/dom',
    'dojo/dom-style',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',
    'agrc/widgets/locate/FindAddress',
    'agrc/widgets/locate/MagicZoom',

    'ijit/widgets/authentication/LoginRegister',

    'esri/SpatialReference',
    'esri/layers/QueryDataSource',
    'esri/layers/LayerDataSource',
    'esri/layers/FeatureLayer',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/renderers/UniqueValueRenderer',
    'esri/renderers/ScaleDependentRenderer',

    './config',


    'bootstrap'
], function(
    template,

    declare,
    array,
    dojoString,

    dom,
    domStyle,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    registry,

    BaseMap,
    BaseMapSelector,
    FindAddress,
    MagicZoom,

    LoginRegister,

    SpatialReference,
    QueryDataSource,
    LayerDataSource,
    FeatureLayer,
    ArcGISDynamicMapServiceLayer,
    UniqueValueRenderer,
    ScaleDependentRenderer,

    config
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        // childWidgets: Object[]
        //      container for holding custom child widgets
        childWidgets: null,

        // map: agrc.widgets.map.Basemap
        map: null,

        constructor: function() {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            config.app = this;
            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate: function() {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            // set version number
            this.version.innerHTML = config.version;

            this.initMap();

            this.childWidgets.push(
                new FindAddress({
                    map: this.map,
                    apiKey: config.apiKey
                }, this.geocodeNode),
                new MagicZoom({
                    map: this.map,
                    mapServiceURL: config.urls.vector,
                    searchLayerIndex: 4,
                    searchField: 'NAME',
                    placeHolder: 'place name...',
                    maxResultsToDisplay: 10
                }, this.placesNode),
                new LoginRegister({
                    appName: config.appName,
                    logoutDiv: this.logoutDiv,
                    securedServicesBaseUrl: config.urls.featureService
                })
            );

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function (widget) {
                that.own(widget);
                widget.startup();
            });


            this.inherited(arguments);
        },
        initMap: function() {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false,
                showAttribution: false
            });

            this.childWidgets.push(
                new BaseMapSelector({
                    map: this.map,
                    id: 'claro',
                    position: 'TR',
                    defaultThemeLabel: 'Lite'
                })
            );

            var queryDataSource = new QueryDataSource();
            queryDataSource.workspaceId = config.workspaceId;
            queryDataSource.query = dojoString.substitute(config.query, {
                provName: 'All West',
                ownerName: config.ownerName
            });
            queryDataSource.oidFields = ['OBJECTID'];
            queryDataSource.geometryType = 'polygon';
            queryDataSource.spatialReference = new SpatialReference({wkid: 26912});

            var layerDataSource = new LayerDataSource();
            layerDataSource.dataSource = queryDataSource;

            var fLayer = new FeatureLayer(config.urls.mapService + '/dynamicLayer', {
                source: layerDataSource,
                autoGeneralize: false
            });

            var scaleRenderer = new ScaleDependentRenderer({
                rendererInfos: [{
                    renderer: new UniqueValueRenderer(config.renderers.fine),
                    minScale: config.renderers.maxScaleForCoarse
                },{
                    renderer: new UniqueValueRenderer(config.renderers.coarse),
                    maxScale: config.renderers.maxScaleForCoarse
                }]
            });
            fLayer.setRenderer(scaleRenderer);
            // fLayer.setOpacity(0.8);

            this.map.addLayer(new ArcGISDynamicMapServiceLayer(config.urls.mapService));

            this.map.addLayer(fLayer);
        }
    });
});
