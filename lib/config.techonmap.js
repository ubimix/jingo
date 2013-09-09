var Utils = require('./yaml.utils');
var _ = require('underscore')._;
var Twitter = require('ntwitter');
var config = require('./config');

module.exports = function(app) {

    var routes = require("../routes");

    // Routes
    app.get('/api', function(request, response) {
        response.send('GeoItem API is running');
    });
    
    
    function getDataRoot() {
        return config.application.repository + config.application.docSubdir || '';
    }

    // TODO: cache
    // TODO: externalize data repository configuration
    app.get('/api/items', function(request, response) {
        var files = Utils.getFilesByExtension(getDataRoot(), 'md');
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
        Utils.toFile(mdYaml.name, mdYaml.content, getDataRoot(), 'md');
        return response.send('ok');
    });

    app.put('/api/items/:id', function(request, response) {
        var id = request.params.id;
        console.log('ID: %i', id);
    });

    var twitterCli = new Twitter({
        consumer_key : '',
        consumer_secret : '',
        access_token_key : '',
        access_token_secret : ''
    });

    app.get('/api/twitter/last', function(request, response) {

        twitterCli.get('/statuses/user_timeline.json', {
            screen_name : "TechOnMap"
        }, function(err, data) {
            response.send(data[0]);
        });
    });

}