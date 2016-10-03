define([
    './config',
    './MapController',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/request',
    'dojo/text!./templates/Editor.html',
    'dojo/topic',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    config,
    MapController,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    xhr,
    template,
    topic,
    array,
    declare,
    lang
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Handles making edits to selected features.

        templateString: template,
        baseClass: 'editor navbar navbar-inverse navbar-fixed-bottom closed',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function () {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app.Editor::postCreate', arguments);

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function () {
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
            //      all of the currently selected features
            console.log('app.Editor::onFeaturesSelected', arguments);

            if (features.length === 0) {
                this.toggle(false);
            } else {
                this.toggle(true);
            }
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
        submit: function (evt) {
            // summary:
            //      sends the id's off to the editing api
            // evt: click event on a button
            console.log('app.Editor::submit', arguments);

            var coverage = evt.target.value;
            var honeyComb = MapController.getHoneyComb(coverage);

            var data = {
                token: config.user.token,
                f: 'json',
                adds: JSON.stringify(honeyComb.adds),
                updates: JSON.stringify(honeyComb.updates)
            };

            var params = {
                data: data,
                handleAs: 'json'
            };

            var self = this;
            xhr.post(config.urls.applyEdits, params).then(function () {
                self.cancel();
                topic.publish(config.topics.map.refreshProvider);
            });
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
