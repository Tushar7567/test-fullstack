const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('../DB/connection');
const User = require('../model/userSchema');

const authenticate = require("../middleware/authenticate")

router.get("/api",(req,res)=>{
    // res.send("You are connected from router.js")
    res.json("connected backend")
})

router.post("/signup", async(req,res)=>{
    // console.log(req.body);
    // res.json({message : req.body})
    // res.send("SignUp")


    console.log(req.body);

    const {name, email, phone, password, cpassword} = req.body;

    if(!name || !email || !phone || !password || !cpassword){
        return res.status(422).json({ error : "Please fill the value properly"});
    }

    try{
        const userExist = await User.findOne({email : email});
        
        if(userExist){
            console.log( "Email already exist");
            return res.status(422).json({ error : "Email already exist"});
        }else if(password != cpassword){
            console.log( "Password does not match");
            return res.status(422).json({ error : "Password does not match"});
        } else{
            const user = new User({name, email, phone, password, cpassword});

            await user.save();
			
			

            console.log(user);
            res.status(200).json({ message : "User registered successfully"});
           
        }
    }
    catch(err) {
        console.log(err);
    };

})



router.post("/signin", async (req,res) => {
    // console.log(req.body);
    // res.json({message : "Success"})
    // res.send("SignIn")


   try{
        console.log(req.body);
        const {email, password} = req.body;

        if( !email || !password ){
            return res.status(400).json({ error : "Please fill the data"});
        } 

        const userLogin = await User.findOne({email : email})
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

			console.log(isMatch);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({error: "Invalid Credentials"});
            }
                // res.redirect("/");
                // res.json()
                // res.send(req.cookies)
            res.status(200).json({message : "User signin successfully"});
                // if()
            
        }else{
            res.status(400).json({error: "Invalid Credentials"});
        }
        // res.json({message : "User signin successfully"});
   }
   catch(err){
    console.log(err);
   }
})

router.get("/logout",(req,res)=>{
    console.log("Hello logout page");
    res.clearCookie('jwtoken', {path: "/"});
    res.status(200).send("User logout")
})


router.get("/signin/admin", authenticate ,(req,res)=>{
    console.log(req.body);
    // res.send(req.parentUser)
    try{
        res.send("admin is everything ok")
    }
    catch(err){
        console.log(err);
    }

});



module.exports = router;



