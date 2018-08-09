var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static('public'))//Public is the folder which has all the html,css&js files as a static resourse
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/regdb');//regdb is the DB
var db = mongoose.connection;//through this 'var db' we can comm. with Database

db.on('error', function () {
    console.log('Connection Failed!!');
});

db.on('open', function () {
    console.log('Connection is established!!');
});

var jobSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is Required!"]
    },
   
    location: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true
    },
    usertype: {
        type:String,
        required:true
    },
    activeUser: {
        type:Boolean,
        default:false,
        required:true
    },
    applied:[String],
    saved:[String]


});

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true
    },
   
    keywords: {
        type: String,
        required: true

    },
    location: {
        type: String,
        required: true
    },
    
    activeUser: {
        type:String,
        
    }

});

// var statusSchema = mongoose.Schema({
//     username: {
//         type: String,
//         unique: true
//     },
//     applied : {
//         type: String,
//         required: true
//     },
   
//     save: {
//         type: String,
//         required: true

//     },
//     location: {
//         type: String,
//         required: true
//     },
    
//     activeUser: {
//         type:String,
        
//     }

// });


var role = mongoose.model('jobColl',jobSchema);
var jobp = mongoose.model('postColl',postSchema);
// var status = mangoose.model('jobstatus',statusSchema);

app.post('/reg1',function(req,res){
    var push = new role(req.body);
    push.save();
})

app.post('/login1',function(req,res){
    // console.log(req.body);
    role.findOne({username:req.body.username},function(error,docs){
        if(!docs)
        {
            res.json({
                flag:'failed',
                
            })
        }else
        {
            if(docs.password==req.body.password)
            {
                role.findOneAndUpdate({username:req.body.username},{$set:{'activeUser':true}},function(error,data){
                    if(!error){
                        res.json({
                            flag:'success',
                            data:data
                        })
                    }
                }) 
                
            }else{
                res.json({
                    flag:'failed',
                    
                })
            }
            
        }
    })
})

app.post('/post1',function(req,res){
    var push = new jobp(req.body);
    push.save();
})
app.post('/search1',function (req,res){
    jobp.find({$or:[{title:req.body.title},{location:req.body.location},{keywords:req.body.keywords}]},function(error,docs)
    {
        console.log(docs);
        if(!docs)
        {
            res.json({
                flag:'failed',
                
            })
        }
        else
        {
            res.json({
                flag:'success',
                data:docs
                
            })
        }
    })
})

app.post('/saved1/:un',function(req,res){
    role.findOne({
        username:req.params.un
    }).then((user)=>{
        //console.log(req.body.jobid);
        //console.log(user.saved.indexOf(req.body.jobid));
    if(user.saved.includes(req.body.jobid)){    
        var index = user.saved.indexOf(req.body.jobid);
        if (index > -1) {
          user.saved.splice(index, 1);
        }
    }
      else {
        user.saved.push(req.body.jobid);
      }
        
        
        // if(user.saved.includes(req.body.jobid))
        // {
        //     console.log("saved here");
        // user.saved.push(req.body.jobid);
        // }
        // else
        // {
        //     console.log("saved here2");
        //     user.saved.pop(req.body.jobid);
        // }
            user.save().then(user=>{
                console.log(user);
                res.send(user);
       
        });
    })
})

app.get("/users/:username", function (req, res) {
    role.findOne({
      username: req.params.username
    }).then(user => {
      res.send(user);
    }).catch(() => {
      res.send("user not found");
    })
  
  });
  

app.post('/applied1/:un',function(req,res){
    // console.log(req.params.un);
    // console.log(req.body.jobid);
    role.findOne({
        username:req.params.un
    }).then((user)=>{
        //console.log(req.body.jobid);
        //console.log(user.saved.indexOf(req.body.jobid));
    if(user.applied.includes(req.body.jobid)){    
        var index = user.applied.indexOf(req.body.jobid);
        if (index > -1) {
          user.applied.splice(index, 1);
        }
    }
      else {
        user.applied.push(req.body.jobid);
      }

            user.save().then(user=>{
                console.log(user);
                res.send(user);
       
        });
    })

    
})

app.post('/getAppliedJobs/:un',function(req,res){
    console.log("req received")
    role.findOne({username:req.params.un}).then((user)=>{
        console.log(user);
        jobp.find({
            _id:{
                $in:user.applied
            }
        }).then((jobs)=>{
            res.send(jobs);
        //  console.log(jobs);
        })
    })
})

app.post('/getSavedJobs/:un',function(req,res){
    console.log("req save received")
    role.findOne({username:req.params.un}).then((user)=>{
        console.log(user);
        jobp.find({
            _id:{
                $in:user.saved
            }
        }).then((jobs)=>{
            res.send(jobs);
        //  console.log(jobs);
        })
    })
})


app.post('/logout1',function(req,res){
    console.log("logout recieved")
    
    role.findOneAndUpdate({username:req.body.username},{$set:{'activeUser':false}},function(error,data)
    {   
        if(!error){
            res.json({
                flag:'success',
                data:data
            })
        }
         else
         {
                res.json({
                    flag:'failed',
                    
                })
            }
        

    })

})
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
})



app.listen(8000, function () {
    console.log('Middleware/Express/Node/Backend is running on localhost:8000');
});