define([
    'dojo/text!app/templates/App.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/string',

    'dojo/dom',
    'dojo/dom-style',

    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',

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
    './MapController',

    './data/mapLayers',


    'bootstrap'
], function(
    template,

    declare,
    array,
    dojoString,

    dom,
    domStyle,

    topic,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    registry,

    FindAddress,
    MagicZoom,

    LoginRegister,

    config,
    MapController,

    mapLayers
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

            var login = new LoginRegister({
                appName: config.appName,
                logoutDiv: this.logoutDiv,
                securedServicesBaseUrl: 'blah'
            });

            var that = this;
            login.on('sign-in-success', function (event) {
                config.user = event.user;

                that.providerNameSpan.innerHTML = event.user.agency;

                array.forEach(mapLayers, function(layer){
                    topic.publish(config.topics.map.enableLayer, layer);
                }, that);
            });

            MapController.init({
                mapDiv: that.mapDiv
            });
            
            this.childWidgets.push(
                new FindAddress({
                    map: MapController.map,
                    apiKey: config.apiKey
                }, this.geocodeNode),
                new MagicZoom({
                    map: MapController.map,
                    mapServiceURL: config.urls.vector,
                    searchLayerIndex: 4,
                    searchField: 'NAME',
                    placeHolder: 'place name...',
                    maxResultsToDisplay: 10
                }, this.placesNode),
                login
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
