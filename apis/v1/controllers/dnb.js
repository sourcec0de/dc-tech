var DNB = require(__root_path + '/libs/dnb.js');
var authFile = __root_path + '/config/.auth';
var maxRetries = 0;
var dnb = new DNB(__gapps.dnb, maxRetries, authFile)


module.exports.search = function(req,res,next){
  res.json(req.endpointParams);
};

module.exports.geo = function(req,res,next){
    dnb.mobileApi({
        method:"GET",
        endpoint:"/businesses",
        params:req.query
    }, function(err,data){
        // console.log(data.body)
        var errorFound = (err !== null || data.body.error.code !== void 0);
        var error = err || data.body.error;
        console.log(error,errorFound)
        if(errorFound) return res.json({error:error},400);
        res.json(data.body)
    });
}