var fs = require('fs');
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var twKeys = require('./keys.js');
var fs = require('fs');
var client = new Twitter({
    consumer_key: twKeys.consumer_key,
    consumer_secret: twKeys.consumer_secret,
    access_token_key: twKeys.access_token_key,
    access_token_secret: twKeys.access_token_secret
});

var twit = process.argv[2];
var title = process.argv[3];

function test(com1, com2) {
    switch (com1) {
        case 'my-tweets':
            tweets();
            break;

        case 'spotify-this-song':
            spot(com2);
            break;

        case 'movie-this':
            movie(com2);
            break;

        case 'do-what-it-says':
            doIt();
            break;
    }
}

function tweets() {
    //https://api.twitter.com/1.1/statuses/lookup.json?id=
    var params = {
        screen_name: 'zenleoleo'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var tweet = tweets[i];
                console.log(JSON.stringify(tweet.text, null, 2));
                console.log(JSON.stringify(tweet.created_at, null, 2));
            }

        }
    });
}

function spot(song) {
    var spotify = new Spotify({
        id: 'ffe0bbf3c52345f180151505beb25bae',
        secret: 'ab7564f5ec8b4d04b5cb185773702614'
    });
    if (!song) {
        song = 'The Ace';
    }
    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var a = data.tracks.items[0].artists[0].name;
        var b = data.tracks.items[0].name;
        var c = data.tracks.items[0].artists[0].external_urls.spotify;
        var d = data.tracks.items[0].album.name;
        console.log(a, '\n', b, '\n', c, '\n', d);
    });
}

function movie(title) {
    if (!title) {
        title = 'Mr. Nobody'
    }
    request('http://www.omdbapi.com/?t=' + title + '&apikey=2ec4d44b', function (err, response, body) {
        if (err) {
            console.log(err);
        }
        var data = JSON.parse(body)
        var tit = data.Title;
        var year = data.Year;
        var imdb = data.Ratings[0];
        var tom = data.Ratings[1];
        var land = data.Country;
        var lang = data.Language;
        var plot = data.Plot;
        var fakers = data.Actors;
        console.log(tit, '\n', year, '\n', imdb, '\n', tom, '\n', land, '\n', lang, '\n', plot, '\n', fakers);
    });
}

function doIt() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var command = data.split(',')
        for (var i = 0; i < command.length; i++) {
            console.log(command[i]);
        }
        var com1 = command[0];

        var com2 = command[1];
        test(com1, com2);
    })

}
test(twit, title);