define([
    'app/config'
], function (
    config
    ) {
    return [{
        url: config.urls.mapService + '/dynamicLayer',
        serviceType: 'provider'
    }, {
        url: config.urls.mapService,
        serviceType: 'dynamic'
    }];
});