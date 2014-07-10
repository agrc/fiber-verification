require([
    'app/MapController',

    'dojo/dom-construct'

], function (
    MapController,

    domConstruct
    ) {
    describe('app/MapController', function () {
        beforeEach(function () {
            MapController.init({mapDiv: domConstruct.create('div', null, document.body)});
        });
        afterEach(function () {
            MapController.destroy();
        });

        describe('onMapClick', function () {
            it('calls selectFeatures if no draw tool is active', function () {
                spyOn(MapController, 'selectFeatures');
                var mapPoint = {};
                MapController.activateTool('POLYGON');

                MapController.onMapClick({mapPoint: mapPoint});

                expect(MapController.selectFeatures).not.toHaveBeenCalled();

                MapController.activateTool('none');

                MapController.onMapClick({mapPoint: mapPoint});

                expect(MapController.selectFeatures).toHaveBeenCalledWith(mapPoint);
            });
        });
    });
});