const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1/reptMonitoring", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const userSchema = new mongoose.Schema({
    userName : String,
    userPw : String,
    userEmail : String
});

const User = mongoose.model("User", userSchema);

const animalSchema = new mongoose.Schema({
    user : String,
    ssp : String,
    gender : String,
    morph: String,
    birthDay : String,
    userID : String,
    feedingFrequency : Number

}); 

const Animal = mongoose.model("Animal", animalSchema);

var currentUser = {} ;

//signup seems working
//needs restrictions about the inputs, but its working
app.post(`/signup`, (req,res)=>{

    async function newUser(){
        const user = new User({
            userName : req.body.userName,
            userPw : req.body.psw,
            userEmail : req.body.email
        });
        user.save();
        console.log(`user "${user.userName}" signed up successfully.`);
        res.render(`login`,{pageName : 'Login'})
    }

    if (req.body.psw === req.body.psw_repeat){
        newUser();
    } else {
        res.render(`signup`,{pageName : 'signup'});
        console.log(`Passwords doesnt match.`);
    }
});

app.get(`/signup`, (req,res)=>{
    res.render(`signup`,{pageName : 'signup'});
});

app.get(`/login`, (req,res)=>{
    res.render(`login` ,{pageName : 'Login'});
})

app.post(`/login`, (req,res)=>{
    const userNameTry = req.body.userName;
    const userPwTry = req.body.psw;
    async function userAuthenticator(){
        try{
            const query = {userName : userNameTry};
            const user = await User.find(query);
            if (user[0].userPw === userPwTry){
                currentUser = user[0];
                console.log(`user "${currentUser.userName}" successfully connected`);
                res.render(`loginStatus` ,{pageName : 'success'});
            } else{
                console.log(`wrong password`);
                res.render(`login` ,{pageName : 'wrong password'});
            }


        }catch(err){
            console.log(`user "${userNameTry}" does not exist.`);
            res.render(`login` ,{pageName : `user "${userNameTry}" does not exist.`});
        }

    }
    userAuthenticator();

});


app.get('/',(req,res)=>{
    pageName = `home`;
    res.render(`home`,{pageName : pageName })
})

//register page
app.get(`/register`, (req,res)=>{
    pageName = `register`;
    res.render(`register`,{pageName : pageName })

})

app.post(`/register`, (req,res)=>{

    //the data user gives, to register a new animal
    //maybe needs to get into the async with the REQ
    async function newAnimalRegister(){

        const animal = new Animal({
            user :currentUser._id,
            ssp : req.body.ssp,
            gender : req.body.gender,
            morph : req.body.morph,
            birthDay : req.body.birthDay,
            userID : req.body.userID,
            feedingFrequency : req.body.feedingFrequency
        });
        animal.save();
        console.log(`save done`);
    };

    newAnimalRegister();
    res.redirect(`/register`);
})

app.get(`/overview`, (req,res)=>{

    async function userLivestock (){
        try{
            const find = {user : currentUser._id};
            const findResult = await Animal.find(find);
            res.render(`overview`, {pageName : `overview`, content : findResult });
        }catch(err){
            console.error(err);
            res.render(`overview`, {pageName : `error`, content : `error` });
        }
    }

    userLivestock();

})


app.listen(port, ()=>{
    console.log(`your server is up at port ${port}`)
})
