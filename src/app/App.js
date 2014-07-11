define([
    'dojo/text!./templates/App.html',

    'dojo/_base/declare',
    'dojo/_base/array',

    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'agrc/widgets/locate/FindAddress',
    'agrc/widgets/locate/MagicZoom',

    'ijit/widgets/authentication/LoginRegister',

    './config',
    './MapController',
    './SelectionTools',
    './Editor',

    './data/mapLayers',


    'bootstrap'
], function(
    template,

    declare,
    array,

    topic,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    FindAddress,
    MagicZoom,

    LoginRegister,

    config,
    MapController,
    SelectionTools,
    Editor,

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
            MapController.startup();
            
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
                login,
                new SelectionTools(null, this.selectionToolsDiv),
                new Editor(null, this.editorDiv)
            );

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function (widget) {
                console.log(widget.declaredClass);
                that.own(widget);
                widget.startup();
            });

            this.inherited(arguments);
        }
    });
});
