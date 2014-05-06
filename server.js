/**
 * Created by aleckim on 2014. 5. 6..
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todo');

app.configure(function() {
    //set the static files location /public/img will be /img
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

// define model
var Todo = mongoose.model('Todo', {
    text : String
});


// routes
// api
// get all todos
app.get('/api/todos', function(req,res) {

    //use mongoose to get all todos in the database
   Todo.find(function(err, todos) {
      if (err)
        res.send(err);

      res.json(todos); // return all todos in JSON format
   }) ;
});

// create todo and send back all todos after cration
app.post('/api/todos', function(req, res) {

     //create a todo, infromation comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if(err)
            res.send(err);

        //get and return all the todos
        Todo.find(function(err, todos) {
            if(err)
                res.send(err);
            res.json(todos);
        });
    });
});

//delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function (err, todo) {
        if (err)
            res.send(err);

         //get and return all the todos
        Todo.find(function(err, todos) {
            if(err)
                res.send(err);
            res.json(todos);
        });
    });
});

//application
app.get('*', function(req,res) {
    //load the single view
    //(angular will handle the page changes on the front end)
    res.sendfile('./public/index.html');
});

// listen
app.listen(8080);
console.log("App listening on port 8080");

