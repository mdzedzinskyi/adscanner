'use strict';

const OlxDataProvider = require('./OLX/OlxDataProvider.js');

function AdsDataProvidersFactory(config) {
    if (!(this instanceof AdsDataProvidersFactory)) return new AdsDataProvidersFactory();
}

AdsDataProvidersFactory.prototype.getAllDataProviders = function () {
    return [
        OlxDataProvider
    ];
};

module.exports = AdsDataProvidersFactory;