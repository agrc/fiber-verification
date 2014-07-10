require([
    'app/SelectionTools',

    'dojo/query',

    'dojo/dom-construct',
    'dojo/dom-class'
], function(
    WidgetUnderTest,

    query,

    domConstruct,
    domClass
) {
    describe('app/SelectionTools', function() {
        var widget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };

        beforeEach(function() {
            widget = new WidgetUnderTest(null, domConstruct.create('div', null, document.body));
            widget.startup();
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a SelectionTools', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('onBtnClick', function () {
            it('should set the clicked button to active and all other inactive', function () {
                var btns = query('.btn', widget.domNode);

                expect(domClass.contains(btns[0], 'active')).toBe(true);

                widget.onBtnClick({target: btns[1]});

                expect(domClass.contains(btns[1], 'active')).toBe(true);
                expect(domClass.contains(btns[0], 'active')).toBe(false);
                expect(domClass.contains(btns[2], 'active')).toBe(false);
            });
        });
    });
});