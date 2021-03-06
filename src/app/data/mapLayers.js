define([
    '../config',
    '../MapController',

    'esri/geometry/Extent',
    'esri/layers/FeatureLayer',

    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/CartographicLineSymbol',

    'esri/renderers/UniqueValueRenderer',
    'esri/renderers/ScaleDependentRenderer',

    'dojo/_base/Color',
    'dojo/_base/array',
    'dojo/topic'
], function (
    config,
    MapController,

    Extent,
    FeatureLayer,

    SimpleFillSymbol,
    CartographicLineSymbol,

    UniqueValueRenderer,
    ScaleDependentRenderer,

    Color,
    array,
    topic
    ) {
    var layers = [{
        url: config.urls.mapService + '/dynamicLayer',
        serviceType: 'provider',
        postCreationCallback: function (lyr) {
            MapController.providerLayer = lyr;

            lyr.setDefinitionExpression('ProvName = \'' + config.user.agency + '\'');

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
            var h = topic.subscribe(config.topics.map.refreshProvider, function () {
                if (lyr.loadError) {
                    h.remove();
                    MapController.map.removeLayer(lyr);
                    MapController.addLayerAndMakeVisible(layers[0]);
                } else {
                    lyr.refresh();
                }
            });
            var h2 = lyr.on('update-end', function () {
                h2.remove();

                if (lyr.graphics.length) {
                    var e = lyr.graphics[0].geometry.getExtent();
                    array.forEach(lyr.graphics, function (g) {
                        e = e.union(g.geometry.getExtent());
                    });
                    MapController.map.setExtent(e, true);
                }
            });
        },
        layerProps: {
            autoGeneralize: false,
            outFields: [
                config.fieldNames.QualifiedServiceClass,
                config.fieldNames.QualifiedHexID,
                config.fieldNames.QualifiedServiceAreasOBJECTID
            ]
        },
        id: config.layerIds.provider
    }, {
        url: config.urls.mapService,
        serviceType: 'dynamic'
    }, {
        url: config.urls.mapService + '/0',
        serviceType: 'feature',
        layerProps: {
            autoGeneralize: false,
            mode: FeatureLayer.MODE_SELECTION,
            outFields: [config.fieldNames.HexID]
        },
        id: config.layerIds.selection,
        postCreationCallback: function (lyr) {
            lyr.setSelectionSymbol(new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new CartographicLineSymbol(
                    CartographicLineSymbol.STYLE_SOLID,
                    new Color('#F012BE'),
                    3,
                    CartographicLineSymbol.CAP_ROUND,
                    CartographicLineSymbol.JOIN_ROUND),
                new Color([85, 85, 85, 0.3])
            ));
            lyr.setMinScale(0);
            lyr.on('click', function (evt) {
                console.log(evt);
                topic.publish(config.topics.map.selectedFeatureClicked, evt.mapPoint);
                evt.stopPropagation();
            });
            lyr.on('selection-complete', function (evt) {
                topic.publish(config.topics.map.featuresSelected, evt.target.getSelectedFeatures());
            });
            topic.subscribe(config.topics.map.clearSelection, function () {
                lyr.clearSelection();
            });
        }
    }];

    return layers;
});
