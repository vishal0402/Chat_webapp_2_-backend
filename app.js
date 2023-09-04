var express = require("express");
var BodyParser = require("body-parser");
var App = express();
var server = require("http").createServer(App);
var SocketIO = require("socket.io")(server);
var cors = require("cors");
var mongoose = require("mongoose");
const { env } = require("process");

App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());

App.use(cors());

var dbURI =
  "mongodb+srv://practice2:practice2@practice2.0c70v.mongodb.net/assignment-3?retryWrites=true&w=majority";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(dbURI, options).then(() => {
  console.log("Database connection established");
});

var DataStorageSchema = mongoose.Schema({}, { strict: false });

var DataStorage = mongoose.model("datastorage", DataStorageSchema);

App.get("/Values", async (req, res) => {
  let data = await DataStorage.find({});
  res.send(data);
});

App.post("/FilteredData", async (req, res) => {
  let Dataa = await DataStorage.find({
    Time: { $gte: req.body.StartDate, $lte: req.body.EndDate },
  });
  res.send(Dataa);
});

SocketIO.on("connection", (Client) => {
  console.log("Client Connected");
  setInterval(async () => {
    let BatteryLvl = Math.floor(Math.random() * 100);
    let TemperatureLevel = Math.floor(Math.random() * 100);
    let Time = new Date();
    let Dataaa = {
      BatteryLevel: BatteryLvl,
      TemperatureLevel: TemperatureLevel,
      Time:
        Time.getFullYear() +
        "-" +
        ("0" + (Time.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + Time.getDate()).slice(-2) +
        "T" +
        ("0" + Time.getHours()).slice(-2) +
        ":" +
        ("0" + Time.getMinutes()).slice(-2),
    };
    await DataStorage.insertMany(Dataaa);
    Client.emit("Dataa", Dataaa);
  }, 30000);

  Client.on("disconnect", async (data) => {});
});

// Starting the Server
server.listen(process.env.PORT || "8000", () => {
  console.log("Server Started");
});
