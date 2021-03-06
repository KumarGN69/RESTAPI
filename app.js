
//define the ports for server to listen
const port = process.env.PORT || 3000;

//define express instance
const express = require("express");

//define mongoose instance
const mongoose = require("mongoose");

//define mongoose instance
const bodyParser = require("body-parser");

//define ejs instance
const ejs = require("ejs");

//define mongoose instance
const _= require("lodash");

//instantiate an express app
const app = express();

//set the ejs view for the express app
app.set('view engine', 'ejs');

//for utf-8 encoded parsing
app.use(bodyParser.urlencoded({
  extended: true
}));

//define the folder for ejs files
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-kumargn:Gnk69%40Jay73@cluster0.vpzxn.mongodb.net/wikiDB");

//define the schema for Wiki 
const wikiSchema = new mongoose.Schema({
	title:String,
	content:String
});

//define the model for wiki content
const WikiContent = mongoose.model("articles",wikiSchema);

//chainable routeable handlers

// Route chain handlers for all articles
app.route("/articles")
	.get(function(req,res){
	WikiContent.find({},function(err, foundArticles){
		if(!err){
			res.send(foundArticles);
			}else{
			res.send(err);
			}
		});	
	})
	.post(function(req,res){
	// console.log(req.body.title);
	// console.log(req.body.content);
		const newArticle = new WikiContent({
			title : req.body.title,
			content: req.body.content
		});
		newArticle.save(function(err){
			if(!err){
				res.send("Successfully saved!");
			}else{
			res.send(err);
			}
		});
	})
	.delete(function(req,res){
		WikiContent.deleteMany({},function(err){
			if(!err){
				res.send("Successfully deleted all!");
			}else{
				res.send(err);
			}
		});	
	});

// Route chain handlers for specific article

app.route("/articles/:articleTitle")
	.get(function(req,res){
		const condition = req.params.articleTitle;
		WikiContent.findOne({title:condition},function(err,foundArticle){
			if(foundArticle){
				res.send(foundArticle);
			}else{
				res.send("No Matching article found!");
			}
		});
	})
	.put(function(req,res){
		const condition = req.params.articleTitle;
		WikiContent.updateOne(
			{title:condition},
			{$set:{title: req.body.title,content: req.body.content}},
			{overwrite :true},
			function(err){
				if(!err){
					res.send("updated successfully");
				}else{
					res.send(err);
				}
			});
	})
.patch(function(req,res){
	const condition = req.params.articleTitle;
	WikiContent.updateOne(
	{title:condition},
	{$set: req.body},
	function(err){
		if(!err){
			res.send("Successfully patched");
		}else{
			res.send(err);
		}
	});
})
.delete(function(req,res){
	const condition = req.params.articleTitle;
	WikiContent.deleteOne(
		{title:condition},
		function(err){
			if(!err){
				res.send("Successfully deleted");
			}else{
				res.send(err);	
			}
	});
});

//start the express server and listen for events 
app.listen(port,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("server started on port: "+ port);
	}
});