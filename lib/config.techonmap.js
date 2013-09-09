var Utils = require('./yaml.utils');
var _ = require('underscore')._;
var Twitter = require('ntwitter');
var config = require('./config');
var Git = require('./gitmech');

module.exports = function(app) {

    var routes = require("../routes");

    function getDataRoot() {
        return config.application.repository + config.application.docSubdir || '';
    }

    // Routes
    app.get('/api', function(request, response) {
        response.send('GeoItem API is running');
    });

    app.get("/api/auth", function(request, response) {
        var user = response.locals.user;
        var userId = user ? user.id : null;
        var msg = {
            type : 'User',
            properties : {
                id : userId,
                isLogged : userId != null
            }
        };
        // { "type": "User", "properties": { "id": "XWiki.XWikiGuest",
        // "isLogged": false } }
        response.send(msg);
    });

    // TODO: cache
    app.get('/api/items', function(request, response) {
        var files = Utils.getFilesByExtension(getDataRoot(), 'md');
        var items = [];
        _.each(files, function(file) {
            var obj = Utils.toGeoJson(file);
            if (obj)
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
        var mdYaml = Utils.toMarkedownYaml(item, true);
        var fileName = Utils.toFile(mdYaml.name, mdYaml.content, getDataRoot(), 'md');
        Git.add(fileName, 'Page created (' + fileName + ')', request.user.asGitAuthor, function(err) {
            //request.session.notice = "Page has been created successfully";
            //res.redirect("/wiki/" + pageName);
            return response.send({message:'Page created successfully'});
        });
        
    });

    app.put('/api/items/:id', function(request, response) {
        var id = request.params.id;
        console.log('ID: %i', id);
    });

    var twitterConfig = config.twitterClient;
    var twitterCli = new Twitter({
        consumer_key : twitterConfig.consumerKey,
        consumer_secret : twitterConfig.consumerSecret,
        access_token_key : twitterConfig.accessTokenKey,
        access_token_secret : twitterConfig.accessTokenSecret
    });

    app.get('/api/twitter/last', function(request, response) {

        twitterCli.get('/statuses/user_timeline.json', {
            screen_name : "TechOnMap"
        }, function(err, data) {
            if (data && data.length > 0)
                response.send(data[0]);
            else
                response.send(err);
        });
    });

}