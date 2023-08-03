const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1/reptMonitoring");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const animalSchema = new mongoose.Schema({
    user : String,
    ssp : String,
    gender : Boolean,
    morph: String,
    birthDay : String,
    userID : String,
    feedingFrequency : Number

}); 

const Animal = mongoose.model("Animal", animalSchema);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/pages/home.html');
})


//register page
app.get(`/register`, (req,res)=>{
    res.render(`register`);
})

app.post(`/register`, (req,res)=>{

    //the data user gives, to register a new animal
    //maybe needs to get into the async with the REQ
    async function newAnimalRegister(){
        const animal = new Animal({
            user : userName, //something to link the user and the animal
            ssp : req.body.ssp,
            gender : eq.body.gender,
            morph : req.body.morph,
            birthDay : req.body.birthDay,
            userID : req.body.userID,
            feedingFrequency : req.body.feedingFrequency
        });
        animal.save();
    };

    // for (i in animal){
    //     console.log(i);
    //     console.log(animal[i]);
    // }

    res.redirect(`/register`);
})





app.listen(port, ()=>{
    console.log(`your server is up at port ${port}`)
})
