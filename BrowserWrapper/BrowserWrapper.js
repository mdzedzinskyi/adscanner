'use strict';

const phantom = require('phantom');
const cheerio = require('cheerio');

function BrowserWrapper() {
    if (!(this instanceof BrowserWrapper)) return new BrowserWrapper();
}

module.exports = BrowserWrapper;

BrowserWrapper.prototype.getDocument = function (url) {
    const self = this;

    return phantom.create().then(function(ph){
        self._ph = ph;
        return self._ph.createPage();
    }).then(function(page){
        self._page = page;
        return self._page.open(url);
    }).then(function(status){
        console.log(status);
        return self._page.property('content')
    }).then(function(content){
        return cheerio.load(content);
    }).catch(function(e){
        console.log(e); 
    });
};

BrowserWrapper.prototype.close = function () {
    const self = this;
    setTimeout(function(){
        self._page.close();
        self._ph.exit();
    }, 1000);
};