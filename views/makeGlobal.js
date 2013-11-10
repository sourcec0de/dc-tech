// Inject data into Global Scope
module.exports = function(app){
    console.log(app.models)
    for(var model in app.models){
        global[model] = app.models[model]
    }
}