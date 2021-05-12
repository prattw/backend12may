require("dotenv").config()
const { PORT = 4000, MONGODB_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")

// EST. A CONNECTION
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on("open", () => console.log("Green Light GO!"))
.on("close", () => console.log("Red Light NOGO"))
.on("error", (error) => console.log(error))

// ///////////////////////////////
// // DATABASE CONNECTION
// ////////////////////////////////
// // Establish Connection
// mongoose.connect(MONGODB_URL, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// })
// // Connection Events
// mongoose.connection
// .on("open", () => console.log("You are connected to Mongo"))
// .on("close", () => console.log("You are disconnected from mongo"))
// .on("error", (error) => console.log(error))

// models
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Airborne!")
});

app.get("/people", async (req, res) => {
    try{
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// people create route
app.post("/people", async (req, res) => {
    try{
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

// people update route
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
});

// // People Update Route 
// app.put("/people/:id", async (req, res) => {
//     try {
//         res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
//     } catch (error){
//         res.status(400).json(error)
//     }
// })

// delete
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});


app.listen(PORT, () => console.log("ALL THE WAY!"))