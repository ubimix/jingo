
module.exports = function(app) {
	
	var routes = require("../routes");
	
	app.get    ("/login",                 routes.login);
	app.get    ("/logout",                routes.logout);
	app.get    ("/auth/done",             routes.authDone);

	app.get    ("/",                      routes.index);
	app.get    ("/wiki",                  routes.pageList);
	app.get    ("/wiki/:page",            routes.pageShow);
	app.get    ("/wiki/:page/history",    routes.pageHistory);
	app.get    ("/wiki/:page/:version",   routes.pageShow);
	app.get    ("/wiki/:page/compare/:revisions", routes.pageCompare);

	app.get    ("/search",                routes.search);

	app.get    ("/pages/new",             routes.pageNew);
	app.get    ("/pages/new/:page",       routes.pageNew);
	app.post   ("/pages",                 routes.pageCreate);

	app.get    ("/pages/:page/edit",      routes.pageEdit);
	app.put    ("/pages/:page",           routes.pageUpdate);
	app.delete ("/pages/:page",           routes.pageDestroy);

	app.post   ("/misc/preview",          routes.miscPreview);
	app.get    ("/misc/syntax-reference", routes.miscSyntaxReference);
	app.get    ("/misc/existence",        routes.miscExistence);

	app.all('*', routes.error404);

	
}
