const express = require("express");
const app = express();

const mongoose = require('mongoose');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const path = require("path");

const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().then(() => {
    console.log("connected");
}).catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));// to get id from url
app.use(methodOverride("_method")); // to use PUT request
app.engine('ejs', ejsMate); //To use ejs-mate
app.use(express.static(path.join(__dirname,"/public"))); //To use static files (css files)

app.get("/",(req,res) => {
    res.send("Root")
    console.log("root is working");
});

//index route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// New Route (Create List)
app.get("/listings/new", (req,res) => { // if this route is created after /listings/:id route, it shows error.Bcoz browser thinks listings/new as listings/:id
    res.render("listings/new.ejs");
});

// Show Route (To show individual data when we click on title)
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create Route (To create new list)
app.post("/listings", async(req,res) => {
    //let listing = req.body;
    const newListing = new Listing(req.body);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update Route
app.put("/listings/:id", async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async(req,res) => {
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My Villa",
//         description: "This villa have beach view",
//         price: 2500,
//         location: "Vizag, AP",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully tested");
// });

app.listen(8080,() => {
    console.log("server ls listening at 8080");
});