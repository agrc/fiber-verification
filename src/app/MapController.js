define([
    'dojo/_base/lang',
    'dojo/_base/array',

    'dojo/topic',
    'dojo/string',
    'dojo/dom-construct',

    'esri/graphic',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/SpatialReference',
    'esri/layers/JoinDataSource',
    'esri/layers/LayerDataSource',
    'esri/layers/TableDataSource',
    'esri/layers/LayerMapSource',

    'esri/toolbars/draw',
    'esri/tasks/query',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    './config'
], function(
    lang,
    array,

    topic,
    dojoString,
    domConstruct,

    Graphic,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    FeatureLayer,
    SpatialReference,
    JoinDataSource,
    LayerDataSource,
    TableDataSource,
    LayerMapSource,

    Draw,
    Query,

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

        // map: agrc/widgets/map/BaseMap
        map: null,

        // toolbar: Draw
        //      draw toolbar
        toolbar: null,

        // layers: Layer[]
        //      The collection of layers added with addLayerAndMakeVisible
        layers: null,

        // toolActive: Boolean
        //      Used to track if there is an active tool for the map
        toolActive: null,

        // selectedFeatures: Features[]
        //      The currently selected features
        selectedFeatures: null,

        // providerLayer: FeatureLayer
        //      description
        providerLayer: null,


        // Properties to be sent into init
        // mapDiv: Dom Node
        mapDiv: null,

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
            this.handles.push(
                this.map.on('click', lang.hitch(this, 'onMapClick'))
            );
            config.map = this.map;

            this.childWidgets.push(
                new BaseMapSelector({
                    map: this.map,
                    id: 'claro',
                    position: 'TR',
                    defaultThemeLabel: 'Lite'
                })
            );

            this.layers = {};

            this.setUpSubscribes();
        },
        setUpSubscribes: function() {
            // summary:
            //      subscribes to topics
            console.log('app.MapController::setUpSubscribes', arguments);

            var that = this;
            this.handles.push(
                topic.subscribe(config.topics.map.enableLayer,
                    lang.hitch(this, 'addLayerAndMakeVisible')),
                topic.subscribe(config.topics.selectionTools.activateTool,
                    lang.hitch(this, 'activateTool')),
                topic.subscribe(config.topics.map.selectedFeatureClicked,
                    lang.hitch(this, 'onSelectedFeatureClick')),
                topic.subscribe(config.topics.map.featuresSelected, function(features) {
                    that.selectedFeatures = features;
                })
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

                        // build a valid datasource for the dynamic layer

                        // Service Areas table
                        var tableDataSource = new TableDataSource();
                        tableDataSource.dataSourceName = 'FiberVerification.' +
                                                          config.ownerName +
                                                          '.ProviderServiceAreas';
                        tableDataSource.workspaceId = 'FiberVerification';
                        var layerDataSource2 = new LayerDataSource();
                        layerDataSource2.dataSource = tableDataSource;

                        // Hexagons layer
                        var layerMapSource = new LayerMapSource();
                        layerMapSource.mapLayerId = 0;

                        // join them together
                        var joinDataSource = new JoinDataSource();
                        joinDataSource.joinType = 'right-inner-join';
                        joinDataSource.leftTableKey = 'HexID';
                        joinDataSource.leftTableSource = layerMapSource;
                        joinDataSource.rightTableKey = 'HexID';
                        joinDataSource.rightTableSource = layerDataSource2;

                        // make it into a layer data source
                        var layerDataSource = new LayerDataSource();
                        layerDataSource.dataSource = joinDataSource;

                        props.layerProps = lang.mixin({
                            source: layerDataSource
                        }, props.layerProps);

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
            if (props.postCreationCallback) {
                props.postCreationCallback(lyr);
            }

            this.map.addLayer(lyr);
            this.map.addLoaderToLayer(lyr);

            this.layers[props.id] = lyr;
        },
        startup: function() {
            // summary:
            //      startup once app is attached to dom
            console.log('app.MapController::startup', arguments);

            array.forEach(this.childWidgets, function(widget) {
                widget.startup();
            }, this);
        },
        activateTool: function(geometryType) {
            // summary:
            //      activates tools on the drawing toolbar
            // geometryType: See Draw Constants
            console.log('app.MapController::activateTool', arguments);

            if (!this.toolbar) {
                this.toolbar = new Draw(this.map);

                var that = this;
                this.handles.push(this.toolbar.on('draw-end', function(evt) {
                    that.selectFeatures(evt.geometry);
                }));
            }

            if (geometryType === 'none') {
                this.toolbar.deactivate();
                this.toolActive = false;
            } else {
                this.toolbar.activate(Draw[geometryType]);
                this.toolActive = true;
            }
        },
        onMapClick: function(evt) {
            // summary:
            //      fires when the user clicks on the map
            //      if no draw tool is selected then it selects or deselects the
            //      clicked hexagon
            // evt: Map Click Event Object
            console.log('app.MapController::onMapClick', arguments);

            if (!this.toolActive) {
                this.selectFeatures(evt.mapPoint);
            }
        },
        onSelectedFeatureClick: function(mapPoint) {
            // summary:
            //      removes clicked feature from selection
            // mapPoint: Object
            console.log('app.MapController::onSelectedFeatureClick', arguments);

            this.selectFeatures(mapPoint, true);
        },
        selectFeatures: function(geometry, subtract) {
            // summary:
            //      selects feature in the select feature layer after
            //      the user completes a drawing
            // geometry: Geometry
            // subtract: Boolean (optional)
            console.log('app.MapController:selectFeatures', arguments);

            var query = new Query();
            query.geometry = geometry;

            var type = (subtract) ? FeatureLayer.SELECTION_SUBTRACT : FeatureLayer.SELECTION_ADD;

            this.layers[config.layerIds.selection].selectFeatures(query, type);
        },
        destroy: function() {
            // summary:
            //      destroys all handles
            console.log('app.MapController::destroy', arguments);

            array.forEach(this.handles, function(hand) {
                hand.remove();
            });

            array.forEach(this.childWidgets, function(widget) {
                widget.destroy();
            }, this);

            this.map.destroy();
            domConstruct.destroy(this.mapDiv);
        },
        getHoneyComb: function(serviceType) {
            // summary:
            //      splits selected feature into adds and updates
            // serviceType: String
            console.log('app/MapController:getHoneyComb', arguments);

            var fn = config.fieldNames;
            var existingProviderHexagonIds = {};
            array.forEach(this.providerLayer.graphics, function(g) {
                existingProviderHexagonIds[g.attributes[fn.QualifiedHexID]] =
                    g.attributes[fn.QualifiedServiceAreasOBJECTID];
            });

            var comb = {
                adds: [],
                updates: []
            };

            array.forEach(this.selectedFeatures, function(g) {
                var hexId = g.attributes[fn.HexID];
                var record;

                if (hexId in existingProviderHexagonIds) {
                    // updates
                    record = {
                        OBJECTID: existingProviderHexagonIds[hexId]
                    };
                    record[fn.ProvName] = config.user.agency;
                    record[fn.HexID] = hexId;
                    record[fn.ServiceClass] = parseInt(serviceType, 10);
                    comb.updates.push({
                        attributes: record
                    });
                } else {
                    // adds
                    record = {};
                    record[fn.ProvName] = config.user.agency;
                    record[fn.HexID] = hexId;
                    record[fn.ServiceClass] = parseInt(serviceType, 10);
                    comb.adds.push({
                        attributes: record
                    });
                }
            });

            return comb;
        }
    };
});