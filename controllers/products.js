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
                    price: $(element)
                        .find('link', (itemprop = 'price'))
                        .attr('content'),
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
