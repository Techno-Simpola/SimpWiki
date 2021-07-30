const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/SimpWiki',{useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title : {
      type:  String,
      required : true },
    content : {
      type:  String,
      required : true }
}

//making model Article
const Article = mongoose.model("Article", articleSchema);

//          RESQUEST TARGETTING ALL ARTICLES ///
app.route('/articles')

.get(function(req,res){
    Article.find({},function(err,foundArticles){
        if(!err){
           res.send(foundArticles); //sending to the client
        }
        else{
            res.send(err);
        }

        
    })
})

.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new article");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted");
        }else{
            res.send(err);
        }
    });
});


////////             REQUEST TARGETTING A SPECIFIC ARTICLE //////////////////

app.route("/articles/:articleTitle")

// req.params.articleTitle = "jQuery"

.get(function(req,res){
    
Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles matching with that title");
        }
    });  
})

.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
    function(err){
        if(!err)
        {
            res.send("Seccessfully updated article");
        }else{
            res.send(err);
        }
    });
})

.patch(function(req,res){

    Article.update(
        {title: req.params.articleTitle
        },
        {$set: req.body},
        function(err){
            if(!err)
            {res.send("Successfully patched!!");
            }else{
                res.send(err);
            }
        });
})

.delete(function(req,res){
     
    Article.deleteOne(
        {
            title: req.params.articleTitle
        },
        function(err){
            if(!err){
                res.send("Successfully deleted");
            }else{
                res.send(err);
            }
        });
});


app.listen(3000, function(){
    console.log("The server's Up and running at 3000");
})

