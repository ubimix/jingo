var Utils = require('./yaml.utils');
var _ = require('underscore')._;
var Twitter = require('ntwitter');

module.exports = function(app) {

    var routes = require("../routes");

    // Routes
    app.get('/api', function(request, response) {
        response.send('GeoItem API is running');
    });

    // TODO: cache
    // TODO: externalize data repository configuration
    app.get('/api/items', function(request, response) {
        var files = Utils.getFilesByExtension('../data', 'md');
        var items = [];
        _.each(files, function(file) {
            var obj = Utils.toGeoJson(file);
            items.push(obj);
        });
        var featureCollection = {
            type : "FeatureCollection",
            features : items
        };

        response.send(featureCollection);

    });

    app.post('/api/items', function(request, response) {
        var item = request.body;
        console.log(item);
        var mdYaml = Utils.toMarkedownYaml(item);
        Utils.toFile(mdYaml.name, mdYaml.content, '../data/', 'md');
        return response.send('ok');
    });

    app.put('/api/items/:id', function(request, response) {
        var id = request.params.id;
        console.log('ID: %i', id);
    });

    var twitterCli = new Twitter({
        consumer_key : 'fytCW2YVtV3QYClAIV8vA',
        consumer_secret : 'dnXAumqDkGr5p3gKm9CIC4EPbaV5OkWPpDYU2xVNg',
        access_token_key : '10078002-PlycJAuvnnRfhNyPQBxwIyqvnhHYAHOSTFHngi1ow',
        access_token_secret : '3zqJDH51aCuZxrhMnEmLjrmQPkUPxij0GB0oF3UM'
    });

    app.get('/api/twitter/last', function(request, response) {

        twitterCli.get('/statuses/user_timeline.json', {
            screen_name : "TechOnMap"
        }, function(err, data) {
            response.send(data[0]);
        });
    });

}