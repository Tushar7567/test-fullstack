const express = require('express');
const app = express();
const data1 = require("./Routes/bollywood")
const cors = require("cors")
const path = require("path");

require('./DB/connection')
const User = require('./model/userSchema')

const router = require('./routerr/auth')


const cookieParser = require('cookie-parser');

app.use(express.json()) // application understands the data(in the form of json which app doesnot understand)
// app.use(express.urlencoded());
const corsOptions = {
    origin: true,
   //update: or "origin: true," if you don't wanna add a specific one
};

app.use(cors(corsOptions));

app.use(cookieParser());


app.use("/data", data1)
console.log(data1);


// app.use("/api/users", registerRoutes);
app.use("/", router);

// app.use("/admin", (req,res)=>{
//     console.log("Admin page");
//     res.send("Welcome to Admins page",req.parentUser);
// })


// app.listen(5000,()=>{
//     console.log("server running");
// })

// deployment
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});



app.listen(process.env.PORT||3000,()=>{
    console.log("server running");
})
