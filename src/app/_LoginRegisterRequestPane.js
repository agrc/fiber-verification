define([
    'dojo/text!./templates/_LoginRegisterRequestPane.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/request',
    'dojo/dom-construct',

    'ijit/widgets/authentication/_LoginRegisterRequestPane',

    './config'
], function(
    template,

    declare,
    array,
    request,
    domConstruct,

    ijitLoginRegisterRequestPane,

    config
) {
    return declare([ijitLoginRegisterRequestPane], {
        // description:
        //      Overridden from ijit to add a drop down for provider agency.

        templateString: template,

        // Properties to be sent into constructor
        postCreate: function () {
            // summary:
            //      populate the drop-down
            console.log('app/_LoginRegisterRequestPane:postCreate', arguments);
        
            var params = {
                query: {
                    where: '1 = 1',
                    f: 'json'
                },
                handleAs: 'json'
            };
            var that = this;
            request.get(config.urls.mapService + '/1/query', params)
                .then(function (response) {
                    array.forEach(response.features, function (f) {
                        var name = f.attributes[config.fieldNames.Code];
                        domConstruct.create('option', {
                            value: name,
                            innerHTML: name
                        }, that.companySelect);
                    });
                });

            this.inherited(arguments);
        },
        onCompanySelectChange: function () {
            // summary:
            //      description
            console.log('app/_LoginRegisterRequestPane:onCompanySelectChange', arguments);
        
            this.agencyTxt.value = this.companySelect.value;
        }
    });
});