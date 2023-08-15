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

async function userLivestock (res){
    try{
        const find = {user : currentUser._id};
        const findResult = await Animal.find(find);
        res.render(`overview`, {pageName : `overview`, content : findResult });
    }catch(err){
        console.error(err);
        res.render(`overview`, {pageName : `error`, content : `error` });
    }
}

//signup seems working
//needs restrictions about the inputs, but its working
app.post(`/signup`, (req,res)=>{

    const userNameTry = req.body.userName;
    const emailTry = req.body.email;
    async function validationCheck(){
        try{ // check for existing usernames
            const query = {userName : userNameTry};
            const user = await User.find(query);
            console.log(`user ${user[0].userName} already exists`);
            res.render(`signup`,{pageName : 'signup', signupStatus : `The username already exists.`});
        }catch{
            try{ //check for existing emails
                const query = {userEmail : emailTry};
                const user = await User.find(query);
                console.log(`there is another user with ${user[0].userEmail}.`);
                res.render(`signup`,{pageName : 'signup', signupStatus : `Another user using this email.`});
            }catch{
                const newUser = new User({
                    userName : req.body.userName,
                    userPw : req.body.psw,
                    userEmail : req.body.email
                });
                newUser.save();
                console.log(`user "${newUser.userName}" signed up successfully.`);
                res.render(`login`,{pageName : 'Login', loginStatus: ``})
            }
        }
    }
    if (req.body.psw === req.body.psw_repeat){ // check if the pw and pwRepeat are the same
        validationCheck();    
    } else {
        res.render(`signup`,{pageName : 'signup', signupStatus : `Passwords doesnt match.`});
        console.log(`Passwords doesnt match.`);
    }

});

app.get(`/signup`, (req,res)=>{
    res.render(`signup`,{pageName : 'signup', signupStatus:``});
});

app.get(`/login`, (req,res)=>{
    res.render(`login` ,{pageName : 'Login', loginStatus : ``});
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
                userLivestock(res);
            } else{
                console.log(`the user "${userNameTry}" tried to login with wrong password`);
                res.render(`login` ,{pageName : 'Login', loginStatus : `wrong username or password`});
            }


        }catch(err){
            console.log(`user "${userNameTry}" does not exist.`);
            res.render(`login` ,{pageName : `login`, loginStatus: `wrong username or password`});
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

    userLivestock(res);

})


app.post(`/admin`,(req,res)=>{
    console.log(currentUser);
})

app.listen(port, ()=>{
    console.log(`your server is up at port ${port}`)
})
