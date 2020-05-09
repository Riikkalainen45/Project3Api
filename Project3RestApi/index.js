var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (err, req, res, next) {
    //consele.log(err);
    res.status(422).send({ error: err.message });
});

app.set('view engine', 'ejs');

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//value never read?
var CountrySchema = new Schema({
    ranking: Number,
    country: {
        type: String,
        required: [true, 'Country name is requrired']
    },
    city: { type: String },
    independence: { type: Number },
    currency_name: { type: String },
    temperature: { type: String },
    poster: { type: String },
    dish: { type: String }
});

const Country = mongoose.model(
    "country",
    {
        ranking: Number,
        country: String,
        city: String,
        independence: Number,
        currency_name: String,
        temperature: String,
        poster: String,
        dish: String
    },
    "countries"
);


var uri =
    "mongodb+srv://Rii123:Rii123@desert-kyn4g.mongodb.net/happy2019";

// Yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;


app.listen(8081, function () {
    console.log("listening: http://127.0.0.1:8081");
});

//Haetaan kaikki... find limit 10 tiedot
app.get("/api/hae", function (req, res) {
    Country.find({}, null, function (err, results) {
        if (err) {
            res.json("Virhe järjestelmässä", 500);
        } else {
            res.json(results, 200);
            // res.send(results);
        }
    });
});

app.get("/api/maa/:id", function (req, res) {
  Country.findOne({ _id: req.params.id }).then(function (country) {
      res.send(country);
  });
});

//post käyttäjä luo uuden country -tiedoston
app.post("/api/luo", function (req, res, next) {
    // var country = new Country(req.body);
    //country.save(req, body).then(function (country) {
    Country.create(req.body).then(function (country) {
        res.send(country);
    }).catch(next);
});


// Muokataan maan tietoja id-numeron perusteella. Huomaa ID-arvon lukeminen lisätään uusi käyttäjän kommentti
app.put("/api/muokkaa/:id", function (req, res) {
    Country.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        Country.findOne({ _id: req.params.id }).then(function (country) {
            res.send(country);
        });
    });
});

// Poistetaan maa id:n perusteella (käyttöoikeus? kenelle...)
app.delete("/api/poista/:id", function (req, res) {
    Country.findByIdAndRemove({ _id: req.params.id }).then(function (country) {
        res.send(country);
    });
});

/*
var id = req.params.id;
Country.findByIdAndDelete(id, function (err, results) {

    if (err) {
        console.log(err);
        res.json("Järjestelmässä tapahtui virhe.", 500);
    } // Tietokanta ok, mutta poistettavaa ei löydy. Onko kyseessä virhe vai ei on semantiikkaa
    else if (results == null) {
        res.json("Poistetavaa ei löytynyt.", 200);
    } // Viimeisenä tilanne jossa kaikki ok
    else {
        console.log(results);
        res.json("Deleted " + id + " " + results.title, 200);
    }
});

});

var newCountries = new Countries({
        ranking: 11,
        country: "HappyLand",
        city: "Fun",
        independence: " ",
        currency_name: "candy",
        temperature: "28",
        poster: "",
        dish: "ice cream"
    });
*/
