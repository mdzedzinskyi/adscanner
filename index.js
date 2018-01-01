'use strict';

const https = require('https');
const path = require('path');
const childProcess = require('child_process');
const phantom = require('phantom');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function RealEstateScanner() {
    if (!(this instanceof RealEstateScanner)) return new RealEstateScanner();
}

module.exports = RealEstateScanner;

RealEstateScanner.prototype.stdout = function (message) {
    console.log(message);
};

RealEstateScanner.prototype.scan = function () {
    var _ph, _page, _outObj;

    phantom.create().then(function(ph){
        _ph = ph;
        return _ph.createPage();
    }).then(function(page){
        _page = page;
        return _page.open('https://www.olx.ua/uk/nedvizhimost/prodazha-kvartir/?page=2');
    }).then(function(status){
        console.log(status);
        return _page.property('content')
    }).then(function(content){
        const dom = new JSDOM(content);
        _page.close();
        _ph.exit();
        return dom.window.document;
    }).then(function(document){
        console.log(document)
    }).catch(function(e){
        console.log(e); 
    });

    // https.get("https://www.olx.ua/uk/nedvizhimost/prodazha-kvartir/?page=2", (resp) => {
    //     let data = '';
 
    //     // A chunk of data has been recieved.
    //     resp.on('data', (chunk) => {
    //         data += chunk;
    //     });
        
    //     // The whole response has been received. Print out the result.
    //     resp.on('end', () => {
    //         console.log(data);
    //     });

    // }).on("error", (err) => {
    //     console.log("Error: " + err.message);
    // });
};

const app = new RealEstateScanner();
app.scan();

