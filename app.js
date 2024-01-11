// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// app.use(express.json());
// const cors = require('cors');
// app.use(cors());
// // const bcrypt = require('bcryptjs')

// const jwt = require('jsonwebtoken')

// const JWT_SECRET = "fhgdrhvjbjvygdfnndvmdnfvgvhgdfmhcjfndfgmfjvnfgxmigtuhmdught";

// const mongoUrl = "mongodb+srv://tharunkumarva:Atlas123123@cluster0.6rwnhir.mongodb.net/Register"


// mongoose.connect(mongoUrl,{
   
// })
// .then (()=>{
//     console.log("DB is connect");
// })
// .catch((e)=>console.log(e))

// const UserDetailsSchema = new mongoose.Schema({
//     Firstname: String,
//     lastname: String,
//     //all the new user email should be unique
//     email: {type:String,unique:true},
//     password: String
// }, {
//     collection: "UserInfo"
// });
// mongoose.model("UserInfo", UserDetailsSchema);


// // forget password api


// app.post("/forgot-password",async(req,res)=>{
//     const {email}=req.body;
// try{
//     const oldUser = await User.findOne({email});
//     if(!oldUser){
//         return resizeBy.send("User Not Exits")
//     }
//     // create secreate to generate token which will send to user
//     const secret =JWT_SECRET +oldUser.password
//     const token = jwt.sign({email:oldUser.email, id: oldUser._id},secret,{
//         expiresIn :"5m",
//     });
//     const link  = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
//     console.log(link)
// }catch(error)


// })




// app.listen(3000,()=>{
//     console.log("server is running on 3000")
// })



// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// app.use(express.json());
// const cors = require('cors');
// app.use(cors());
// const bcrypt = require("bcryptjs")
// const jwt = require('jsonwebtoken')
// // to show the Html and js in node
// app.set("view engine","ejs")
// app.use(express.urlencoded({extended:false}))

// const JWT_SECRET = "fhgdrhvjbjvygdfnndvmdnfvgvhgdfmhcjfndfgmfjvnfgxmigtuhmdught";

// const mongoUrl = "mongodb+srv://tharunkumarva:Atlas123123@cluster0.6rwnhir.mongodb.net/Register"

// mongoose.connect(mongoUrl, {})
//     .then(() => {
//         console.log("DB is connected");
//     })
//     .catch((e) => console.log(e))

// const UserDetailsSchema = new mongoose.Schema({
//     Firstname: String,
//     lastname: String,
//     email: { type: String, unique: true },
//     password: String
// }, {
//     collection: "UserInfo"
// });

// const User = mongoose.model("UserInfo", UserDetailsSchema); // Define the model

// app.post("/forgot-password", async (req, res) => {
//     const { email } = req.body;

//     try {
//         const oldUser = await User.findOne({ email });
//         if (!oldUser) {
//             return res.status(404).json({status:"User Not Exists"});
//         }

//         // Create secret to generate token which will be sent to the user
//         const secret = JWT_SECRET + oldUser.password;
//         const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
//             expiresIn: "5m",
//         });

//         const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
//         console.log(link);
        
//         res.status(200).json({ message: "Password reset link sent successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// // to reset password api
// app.get("/reset-password/:id/:token",async(req,res)=>{
//     const{id,token} = req.params;
//     console.log(req.params)
//     const oldUser = await User.findOne({_id:id});
//     if (!oldUser) {
//         return res.status(404).json({status:"User Not Exists"});
//     }
   
//     const secret =JWT_SECRET+oldUser.password
//     try {
//         const verify = jwt.verify(token,secret)
//         res.render("index",{email:verify.email})
//     } catch (error) {
//         console.log(error);
//         res.send("Not verified")
        
//     }
//     res.send("Done");
// })

// app.post("/reset-password/:id/:token",async(req,res)=>{
//     const{id,token} = req.params;
//     const{password} = req.body;
//     const oldUser = await User.findOne({_id:id});
//     if (!oldUser) {
//         return res.status(404).json({status:"User Not Exists"});
//     }
   
//     const secret =JWT_SECRET+oldUser.password
//     try {
//         const verify = jwt.verify(token,secret)
//         const encryptedpassword = await bcrypt.hash(password,10);
//         await User.updateOne(
//             {
//                 _id:id,
//             },
//             {
//                 $set:{
//                     password:encryptedpassword
//                 }
//             }
//         )
//         res.json({status:"password Updated"});
//         // res.render("index",{email:verify.email})
//     } catch (error) {
//         console.log(error);
//         res.json("something went wrong")
        
//     }
//     res.send("Done");
// })

// app.listen(3000, () => {
//     console.log("server is running on 3000");
// });



const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.set("view engine","ejs");

var nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || "fhgdrhvjbjvygdfnndvmdnfvgvhgdfmhcjfndfgmfjvnfgxmigtuhmdught";
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://tharunkumarva:Atlas123123@cluster0.6rwnhir.mongodb.net/Register";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB is connected");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

const UserDetailsSchema = new mongoose.Schema({
    Firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String
}, {
    collection: "UserInfo"
});

const User = mongoose.model("UserInfo", UserDetailsSchema);

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.status(404).json({ status: "User Not Exists" });
        }

        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "1h", // Increase token expiry time
        });

        const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
        var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'successonfly@gmail.com',
    pass: 'khln xpbm lkeq khmx'
  }
});

var mailOptions = {
  from: 'successonfly@gmail.com',
  to: email,
  subject: 'Sending Email using Node.js',
  text: link
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
        console.log(link);

        res.status(200).json({ message: "Password reset link sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(404).json({ status: "User Not Exists" });
        }

        const secret = JWT_SECRET + oldUser.password;
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email,status:"Not verified" });
    } catch (error) {
        console.log(error);
        res.send("Not verified");
    }
});

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const oldUser = await User.findOne({ _id: id });
        if (!oldUser) {
            return res.status(404).json({ status: "User Not Exists" });
        }

        const secret = JWT_SECRET + oldUser.password;
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.updateOne(
            { _id: id },
            { $set: { password: encryptedPassword } }
        );

        // res.json({ status: "Password Updated" });
        res.render("index",{email:verify.email,status:"verified"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

