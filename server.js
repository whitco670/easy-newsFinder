"use strict";
const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
require("dotenv").config();
const axios = require("axios");

const bodyParser = require("body-parser");
const logger = require("morgan");

const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const db = require("./models");

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost.mongo/cycleNews3"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {useMongoClient:true});

// mongoose.Promise = Promise;
// mongoose.connect("mongodb://cycleNews5", {
//   useMongoClient: true
// });



app.get("/retrieve",function(req,res){
	
	axios.get("http://www.velonews.com/category/news/")
	.then(function(response) {
		
		const $ = cheerio.load(response.data);
		
		$("h3.article__title").each(function(i, element){
			
			const result = {};
			result.title = $(this)
				.text().trim();

			result.link = $(this)
				.children()
				.attr("href");	
			
			db.Article.create(result)
				.then(function(dbArticle){
					console.log("==========================")
					console.log(dbArticle);
				})
				.catch(function(err){
					console.log("==========================")
					console.log(err.message);
					// return res.json(err);
				});
			
			});
		res.redirect("/")
		});
	});


app.get("/articles", function(req,res){
	db.Article.find({}).sort({'created_at':-1})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err)

	});	
});

app.get("/articles/:id", function(req, res){
	db.Article.findOne({_id: req.params.id})
	.populate("note")
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

app.post("/articles/:id",function(req, res){
	console.log(req.params.id);
	console.log(req.body);
	db.Note.create(req.body)
		.then(function(dbNote){
			console.log(dbNote);
			//noteId = dbNote._id;
			return db.Article.findOneAndUpdate({_id: req.params.id}, { note: dbNote._id}, {new: true});
		})
	.then(function(dbArticle){
		res.json(dbArticle);
	})	
	.catch(function(err){
		res.json(err);
	});
});




app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});