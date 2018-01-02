'use strict';

const path = require('path');
const DataProvidersFactory = require('./DataProviders/AdsDataProvidersFactory');


function AdScanner() {
    if (!(this instanceof AdScanner)) return new AdScanner();
}

module.exports = AdScanner;

AdScanner.prototype.stdout = function (message) {
    console.log(message);
};

AdScanner.prototype.getDataProviders = function () {
    const factory = new DataProvidersFactory();
    return factory.getAllDataProviders();
};

AdScanner.prototype.scan = function () {
    
};

const app = new AdScanner();
const providers = app.getDataProviders();
for (let i in providers) {
    const DataProvider = providers[i];
    const provider = new DataProvider();
    const offerTypes = provider.getOfferTypes();
    const type = offerTypes.RealEstate.AppartmentForSale;
    const prom = provider.getOffersByType(type).then(function (result) {
        console.log(result);
    });
}