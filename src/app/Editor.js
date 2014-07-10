define([
    'dojo/text!./templates/Editor.html',

    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/dom-class',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    './config'
], function(
    template,

    declare,
    lang,
    topic,
    domClass,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    config
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Handles making edits to selected features.

        templateString: template,
        baseClass: 'editor navbar navbar-inverse navbar-fixed-bottom closed',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app.Editor::postCreate', arguments);

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app.Editor::setupConnections', arguments);

            this.own(
                topic.subscribe(config.topics.map.featuresSelected, lang.hitch(this, 'onFeaturesSelected'))
            );
        },
        onFeaturesSelected: function (features) {
            // summary:
            //      fires when the selection feature layer has completed selecting features
            // features: feature[]
            console.log('app.Editor::onFeaturesSelected', arguments);

            this.toggle(true);
        },
        toggle: function (open) {
            // summary:
            //      hides or shows the toolbar
            // open: Boolean
            console.log('app.Editor::toggle', arguments);

            var to = (open) ? 'open' : 'closed';
            var from = (open) ? 'closed' : 'open';

            if (domClass.contains(this.domNode, from)) {
                domClass.remove(this.domNode, from);
                domClass.add(this.domNode, to);
            }
        },
        cancel: function () {
            // summary:
            //      cancel button clears features and closes form
            console.log('app.Editor:cancel', arguments);

            topic.publish(config.topics.map.clearSelection);

            this.toggle(false);
        }
    });
});