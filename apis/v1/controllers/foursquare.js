var request = require("request");
module.exports.geo = function(req,res,next){
    req.query.client_id = "ANHFJH40KNERDE1GIK2UHFUD1DYBB2YXW3XROBQHWDC1FSOB";
    req.query.client_secret = "JSBIN5XFUXGXBLNWBESF1QZ1NUGZFENIXJ0KUGA3OXJBGPQK";
    req.query.v = "20131109";
    request({
        qs:req.query,
        url:"https://api.foursquare.com/v2/venues/search"
    },function(e,r,b){
        var status = r? r.statusCode : 400;
        if(typeof b === 'string') b = JSON.parse(b);
        res.json(b,status);
    });
}