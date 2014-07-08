define([
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/Color',

    'dojo/dom-construct',

    'dojo/topic',
    'dojo/string',

    'esri/graphic',
    'esri/lang',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/SpatialReference',
    'esri/layers/QueryDataSource',
    'esri/layers/LayerDataSource',
    'esri/renderers/UniqueValueRenderer',
    'esri/renderers/ScaleDependentRenderer',

    'esri/symbols/SimpleLineSymbol',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    './config'
], function(
    lang,
    array,
    Color,

    domConstruct,

    topic,
    dojoString,

    Graphic,
    esriLang,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,
    SpatialReference,
    QueryDataSource,
    LayerDataSource,
    UniqueValueRenderer,
    ScaleDependentRenderer,

    LineSymbol,

    BaseMap,
    BaseMapSelector,

    config
) {
    return {
        // description:
        //      Handles interaction between app widgets and the map. Mostly through pub/sub

        // handles: Object[]
        //      container to track handles for this object
        handles: [],

        // childWidgets: array
        // summary:
        //      holds child widgets 
        childWidgets: null,

        // Properties to be sent into constructor
        // map: agrc/widgets/map/BaseMap
        map: null,

        init: function(params) {
            // summary:
            //      description
            console.log('app.MapController::init', arguments);

            lang.mixin(this, params);

            this.childWidgets = [];

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

            this.symbol = new LineSymbol(LineSymbol.STYLE_SOLID, new Color('#F012BE'), 3);

            this.layers = [];

            this.setUpSubscribes();
        },
        setUpSubscribes: function() {
            // summary:
            //      subscribes to topics
            console.log('app.MapController::setUpSubscribes', arguments);

            this.handles.push(
                topic.subscribe(config.topics.map.enableLayer,
                    lang.hitch(this, 'addLayerAndMakeVisible'))
            );
        },
        addLayerAndMakeVisible: function(props) {
            // summary:
            //      description
            // props: object
            //  { url, serviceType, layerIndex, layerProps }
            console.log('app.MapController::addLayerAndMakeVisible', arguments);

            // check to see if layer has already been added to the map
            var lyr;
            var LayerClass;

            switch (props.serviceType || 'dynamic') {
                case 'provider':
                    {
                        LayerClass = FeatureLayer;
                        var queryDataSource = new QueryDataSource();
                        queryDataSource.workspaceId = config.workspaceId;
                        queryDataSource.query = dojoString.substitute(config.query, {
                            provName: config.user.agency,
                            ownerName: config.ownerName
                        });
                        queryDataSource.oidFields = ['OBJECTID'];
                        queryDataSource.geometryType = 'polygon';
                        queryDataSource.spatialReference = new SpatialReference({wkid: 26912});

                        var layerDataSource = new LayerDataSource();
                        layerDataSource.dataSource = queryDataSource;

                        props.layerProps = {
                            source: layerDataSource,
                            autoGeneralize: false
                        };

                        break;
                    }
                case 'feature':
                    {
                        LayerClass = FeatureLayer;
                        break;
                    }
                case 'tiled':
                    {
                        LayerClass = ArcGISTiledMapServiceLayer;
                        break;
                    }
                default:
                    {
                        LayerClass = ArcGISDynamicMapServiceLayer;
                        break;
                    }
            }

            lyr = new LayerClass(props.url, props.layerProps);

            if (props.serviceType === 'provider') {
                var scaleRenderer = new ScaleDependentRenderer({
                    rendererInfos: [{
                        renderer: new UniqueValueRenderer(config.renderers.fine),
                        minScale: config.renderers.maxScaleForCoarse
                    },{
                        renderer: new UniqueValueRenderer(config.renderers.coarse),
                        maxScale: config.renderers.maxScaleForCoarse
                    }]
                });
                lyr.setRenderer(scaleRenderer);
            }

            this.map.addLayer(lyr);
            this.map.addLoaderToLayer(lyr);

            this.layers.push({
                id: props.id,
                layer: lyr
            });
        },
        startup: function() {
            // summary:
            //      startup once app is attached to dom
            console.log('app.MapController::startup', arguments);

            array.forEach(this.childWidgets, function(widget) {
                widget.startup();
            }, this);
        },
        highlight: function(evt) {
            // summary:
            //      adds the clicked shape geometry to the graphics layer
            //      highlighting it
            // evt - mouse click event
            console.log('app.MapController::highlight', arguments);

            this.clearGraphic(this.graphic);

            this.graphic = new Graphic(evt.graphic.geometry, this.symbol);
            this.map.graphics.add(this.graphic);
        },
        clearGraphic: function(graphic) {
            // summary:
            //      removes the graphic from the map
            // graphic
            console.log('app.MapController::clearGraphic', arguments);

            if (graphic) {
                this.map.graphics.remove(graphic);
                this.graphic = null;
            }
        },
        destroy: function() {
            // summary:
            //      destroys all handles
            console.log('app.MapControl::destroy', arguments);

            array.forEach(this.handles, function(hand) {
                hand.remove();
            });

            array.forEach(this.childWidgets, function(widget) {
                widget.destroy();
            }, this);
        }
    };
});