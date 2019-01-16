var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var app = express();

function listGift(gift){
 request('https://www.uncommongoods.com/gifts/birthday-gifts/birthday-gifts', function(error, response, body) {
        var $ = cheerio.load(body);
        var gifts = $('.product')
            .map(function(index, element) {
                return {
                    item: $(element)
                        .find('h4 span', (itemprop = 'name'))
                        .text(),
                    priceCurrency: $(element)
                        .find('link[itemprop=priceCurrency]')
                        .attr('content'),
                    getPrice: function(){
                        var price = $(element)
                        .find('link[itemprop=price]')
                        .attr('content');

                        if(price){
                            return price;
                        }
                        else {
                            var lowPrice = $(element)
                                .find('link[itemprop=lowPrice]')
                                .attr('content');
                            var highPrice = $(element)
                                .find('link[itemprop=highPrice]')
                                .attr('content');
                            return lowPrice+"-"+ highPrice;
                        }
                    },
                    photo: $(element)
                        .find('article img')
                        .attr('src'),
                    link: $(element)
                        .find('h4 a')
                        .attr('href'),
                };
            }).get();
    });
}

module.exports = {
	listGift
};