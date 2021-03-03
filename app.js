//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lod = require('lodash');
const Data = require('./data');
const mongoose = require("mongoose");
const session = require("express-session");
var VerifyToken = require('./VerifyToken');
var findOrCreate = require('mongoose-findorcreate');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
cartdata = [];
var token = "";
// --------------connection to database --------------------------------------------
mongoose.connect("Process.env.db", { useUnifiedTopology: true }, { useNewUrlParser: true });
const userSchema = new mongoose.Schema({

  name: String,
  firstname: String,
  lastname: String,
  email: String,
  cart: [String]
});
const userAddress = new mongoose.Schema({

  Email: String,
  Address: String,
  State: String,
  City: String,
  Pin: Number
});

userSchema.plugin(findOrCreate);
const User = mongoose.model("Userlogindata", userSchema);
const Userad = mongoose.model("Useradd", userAddress);

// -----------------------------jwt token create-------------
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

// ==========================login=======================

app.post('/login', function (req, res)
{

  User.findOne({ email: req.body.email }, function (err, user)
  {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token });
  });

});

// ===============================logout==================
app.get('/logout', function (req, res)
{
  res.status(200).send({ auth: false, token: null });
});

//=================================register===================
router.post('/register', function (req, res)
{

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    address: req.body.address

  },
    function (err, user)
    {
      if (err) return res.status(500).send("There was a problem registering the user`.");

      // if user is registered without errors
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      res.status(200).send({ auth: true, token: token });
    });

});




app.get("/", function (req, res)
{
  if (name.length === 0)
  {
    res.render("home", { signin: "SIGN IN" });
  }
  else
  {
    res.render("home", { signin: ("Hello " + name) })
  }

})

app.get("/about", (req, res) =>
{
  res.render("about");
})

app.get("/women", (req, res) =>
{
  res.render("women");
})

app.get("/men", (req, res) =>
{
  res.render("men");
})

app.get("/signin", (req, res) =>
{
  res.render("signin");
})

app.get("/displaypage", (req, res) =>
{
  res.render("displaypage");
})

app.get("/men/:menon", (req, res) =>
{
  Data.forEach((search) =>
  {
    if (req.params.menon === search.id)
    {
      res.render("displaypage", { img: search.imageadd1, img1: search.imageadd2, itemname: search.name, no: search.id });
    }
  })
})
app.get("/women/:menon", (req, res) =>
{
  Data.forEach((search) =>
  {
    if (req.params.menon === search.id)
    {
      res.render("displaypage", { img: search.imageadd1, img1: search.imageadd2, itemname: search.name, no: search.id });
    }
  })
});

cartid = [];
app.get("/cart/:p/:no", VerifyToken, (req, res) =>
{

  if (name.length === 0)
  {
    res.redirect("/signin");
  }
  else
  {

    cartid.push(req.params.no);
    Data.forEach((h =>
    {
      if (h.id === req.params.no)
      {
        cartdata.push(h);
      }
    }
    ));
    if (req.params.p === "h")
    {
      res.redirect("/");
    }
    else if (req.params.p === "m")
    {
      res.redirect("/men");
    }
    else if (req.params.p === "w")
    {
      res.redirect("/women");
    }
    else if (req.params.p === "c")
    {
      res.redirect("/cart");
    }
  }
});



app.get("/cart", VerifyToken, (req, res) =>
{
  if (name.length === 0)
  {
    res.redirect("signin");
  }
  else
  {
    res.render("cart", { data: cartdata });
  }
});

app.get("/checkout", (req, res) =>
{
  User.updateOne({ email: emails }, { cart: cartid }, (err, doc) =>
  {
    err ? console.log(err) : console.log(doc);
  });
  res.render("checkout", { name: name });
});

var address = "";
var city = "";
var state = "";
var pin = "";
app.post("/", (req, res) =>
{
  address = req.body.Address;
  states = req.body.State;
  citys = req.body.city;
  pins = req.body.pin;

  var dataadd = new Userad({
    Email: emails,
    Address: req.body.Address,
    State: req.body.State,
    City: req.body.city,
    Pin: req.body.pin

  })
  dataadd.save();
  res.redirect("/finalpage");

});
app.get("/finalpage", (req, res) =>
{
  res.render("finalpage", { name: name, add: address, state: states, city: citys, pin: pins })
})




app.listen(process.env.PORT || 3000, function ()
{
  console.log("Server started on port 3000");
});
