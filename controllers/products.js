var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var db = require('../models'); 
var request = require('request');
var scraper = require('../scraper')

router.get('/', function(req, res) {
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
            })
            .get();
        console.log(gifts);
        res.render('products/show', { gifts: gifts });
    });
});

module.exports = router;
