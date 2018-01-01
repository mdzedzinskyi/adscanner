'use strict';
const BrowserWrapper = require('../../BrowserWrapper/BrowserWrapper');
const cheerio = require('cheerio');

const baseDomain = 'https://www.olx.ua/';

const OfferTypes = {
    RealEstate: {
        AppartmentForSale: function (pageNumber) {return `${baseDomain}uk/nedvizhimost/prodazha-kvartir/?page=${pageNumber}`},
        HouseForSale: function (pageNumber) {return `${baseDomain}uk/nedvizhimost/prodazha-domov/?page=${pageNumber}`}
    },
    Transport: {
        Cars: function (pageNumber) {return `${baseDomain}uk/transport/legkovye-avtomobili/?page=${pageNumber}`}
    }
};

function OlxDataProvider(config) {
    if (!(this instanceof OlxDataProvider)) return new OlxDataProvider();
    this.config = config || {};
}

module.exports = OlxDataProvider;

OlxDataProvider.prototype.handleOffers = function ($, selector) {
    const offers = $(selector);
    const result = [];
    offers.each(function(i, elem){
        const thumbLink = $(this).find('a.thumb');
        const thumbImg = thumbLink.find('img');
        const offerName = $(this).find('strong').text();
        const price = $(this).find('.price strong').text();
        const location = $(this).find('tr:last-child .breadcrumb span').text();
        const time = $(this).find('tr:last-child td:first-child p:last-child').text();

        result.push({
            url: thumbLink.attr('href'),
            img: {
                src: thumbImg.attr('src'),
                alt: thumbImg.attr('alt')
            },
            name: offerName,
            price: price,
            location: location.trim(),
            time: time.trim()
        });
    });

    // offersNodeList.forEach(function (offerEl) {
    //     // if (!offerEl) return;
    //     // const thumbLink = offerEl.querySelector('a.thumb') || {};
    //     // const thumbImg = thumbLink.querySelector('img') || {};
    //     // const offerName = (offerEl.querySelector('strong') || {}).innerHTML;
    //     // const price = (offerEl.querySelector('.price strong') || {}).innerHTML;
    //     // const location = (offerEl.querySelector('tr:last-child .breadcrumb span') || {}).innerHTML;
    //     // const time = (offerEl.querySelector('tr:last-child td:first-child p:last-child') || {}).innerHTML;

    //     // if (thumbLink.href) {
    //     //     BrowserWrapper.getDocument(thumbLink.href).then(function (d) {
    //     //         const mainImg = d.querySelector('#photo-gallery-opener > img');

    //     //     })
    //     // }
        
    //     // result.push({
    //     //     url: thumbLink.href,
    //     //     img: {
    //     //         src: thumbImg.src,
    //     //         alt: thumbImg.alt
    //     //     },
    //     //     name: offerName,
    //     //     price: price,
    //     //     location: location.trim(),
    //     //     time: time.trim()
    //     // });
    // });
    return result;
};

OlxDataProvider.prototype.getOfferTypes = function () {
    return OfferTypes;
}

OlxDataProvider.prototype.getOffersFromPage = function (offerType, pageNumber) {
    const self = this;
    const pageUrl = offerType(pageNumber);
    const browser = new BrowserWrapper();
    return browser.getDocument(pageUrl).then(function (document) {
        const offers = self.handleOffers(document, '#offers_table .offer');
        browser.close();
        console.log(pageNumber);
        return offers;
    });
};

OlxDataProvider.prototype.getOffersByType = function (offerType) {
    const self = this;
    const results = [];
    let pageNumber = 1;

    loadSinglePage(pageNumber);
    
    function loadSinglePage (pageNumber) {
        return new Promise((resolve, reject) => {
            self.getOffersFromPage(offerType, pageNumber).then(function(offers){
                resolve(offers);
            })
        }).then(function (result){
            results.push(result);
            if (pageNumber == 10) {
                console.log(results);
                return;
            };
            loadSinglePage(++pageNumber);
        });
    }
};

var dp = new OlxDataProvider();
var offerTypes = dp.getOfferTypes();
dp.getOffersByType(offerTypes.Transport.Cars);

