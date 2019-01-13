var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var app = express();


app.get('/', function(req, res){
	showGift(req.body)
	.then(function(){
		res.render('/product/show', {items: items});
	})
})



function showGift(){
	request('https://www.uncommongoods.com/gifts/birthday-gifts/birthday-gifts', function(error, response, body){
		var $ = cheerio.load(body);
		var gifts = $('.product').map(function(index, element){
			return {
				item: $(element).find('h4 span', itemprop="name").text(),
				price: $(element).find("link", itemprop="price").attr('content'),
				photo: $(element).find('article img').attr('src'),
				link: $(element).find('h4 a').attr('href')
			};
	}).get()
		return gifts;
	});
}


module.exports = {
	showGift
};