module.exports = function(app) {

	function requireAuthentication(req, res, next) {
		if (!res.locals.user) {
			res.redirect("/login");
			/*
			 * res.statusCode = 403; res.end('<h1>Forbidden</h1>');
			 */
		} else {
			next();
		}
	}
	app.all("/pages/*", requireAuthentication);

	if (!app.locals.authorization.anonRead) {
		app.all("/wiki/*", requireAuthentication);
		app.all("/search", requireAuthentication);
	}
}
