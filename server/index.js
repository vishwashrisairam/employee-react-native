const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('./Employee')

const mongoUri = "mongodb+srv://vsairam:iWbduLkRU5ZrQDcp@cluster0.oeu5j.mongodb.net/test?retryWrites=true&w=majority"
app.use(bodyParser.json())

const Employee = mongoose.model("employee")

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("db connected")
})
mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})

app.get('/',(req,res)=>{
    Employee.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
    
    
})


app.post('/send-data',(req,res)=>{
     const employee = new Employee({
         name:req.body.name,
         email:req.body.email,
         phone:req.body.phone,
         picture:req.body.picture,
         salary:req.body.salary,
         position:req.body.position

     })
     employee.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })
     
})

app.post('/delete',(req,res)=>{
    Employee.findByIdAndRemove(req.body.id)
    .then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.post('/update',(req,res)=>{
    Employee.findByIdAndUpdate(req.body.id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        picture:req.body.picture,
        salary:req.body.salary,
        position:req.body.position
    }).then(data=>{
        console.log(data)
        res.send(data)
    })
    .catch(err=>{
        console.log(err)
    })
})

app.get('/',(req,res)=>{
    res.send("Welcome to node js")
});

app.listen(3000,()=>{
    console.log("server is running!!!")
})