define([
    './config',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/query',
    'dojo/text!./templates/SelectionTools.html',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    config,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    query,
    template,
    topic,
    declare,
    lang
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Contains controls and logic for enabling the user to select hexagons for editing.

        templateString: template,
        baseClass: 'selection-tools',
        widgetsInTemplate: true,

        // btns: Button[]
        //      The buttons in the toolbar
        btns: null,

        // Properties to be sent into constructor

        postCreate: function () {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app.SelectionTools::postCreate', arguments);

            this.setupConnections();

            this.inherited(arguments);
        },
        setupConnections: function () {
            // summary:
            //      wire events, and such
            //
            console.log('app.SelectionTools::setupConnections', arguments);

            this.btns = query('.btn', this.domNode);
            this.btns.onclick(lang.hitch(this, 'onBtnClick'));

        },
        onBtnClick: function (evt) {
            // summary:
            //      fires when a button on the toolbar has been clicked
            // evt: Event Object
            console.log('app.SelectionTools::onBtnClick', arguments);

            this.btns.removeClass('active');

            domClass.add(evt.target, 'active');

            topic.publish(config.topics.selectionTools.activateTool, evt.target.value);
        }
    });
});
