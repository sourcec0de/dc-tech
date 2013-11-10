module.exports = function(app){
    var controllers = app.app.controllers;
    app.get('/',controllers.dnb.index)
    app.get('/search',controllers.dnb.search)
}