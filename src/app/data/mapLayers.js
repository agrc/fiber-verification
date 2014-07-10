define([
    './../config',

    'esri/layers/FeatureLayer',

    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',

    'esri/renderers/UniqueValueRenderer',
    'esri/renderers/ScaleDependentRenderer',

    'dojo/_base/Color',
    'dojo/topic'
], function (
    config,

    FeatureLayer,

    SimpleFillSymbol,
    SimpleLineSymbol,

    UniqueValueRenderer,
    ScaleDependentRenderer,

    Color,
    topic
    ) {
    return [{
        url: config.urls.mapService + '/dynamicLayer',
        serviceType: 'provider',
        postCreationCallback: function (lyr) {
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
    }, {
        url: config.urls.mapService,
        serviceType: 'dynamic'
    }, {
        url: config.urls.mapService + '/0',
        serviceType: 'feature',
        layerProps: {
            autoGeneralize: false,
            mode: FeatureLayer.MODE_SELECTION
        },
        id: config.layerIds.selection,
        postCreationCallback: function (lyr) {
            lyr.setSelectionSymbol(new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('#F012BE'), 3),
                new Color([85, 85, 85, 0.3])
            ));
            lyr.on('click', function (evt) {
                console.log(evt);
                topic.publish(config.topics.map.selectedFeatureClicked, evt.mapPoint);
                evt.stopPropagation();
            });
        }
    }];
});