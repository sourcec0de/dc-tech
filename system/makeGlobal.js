module.exports = function(app){
    for(var model in app.models){
        global[model] = app.models[model]
    }
}