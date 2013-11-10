var request = require("request");
var dnbReport = require(__root_path+"/libs/tests/dnbLibtest.js")
module.exports.geo = function(req, res, next) {
    req.query.client_id = "ANHFJH40KNERDE1GIK2UHFUD1DYBB2YXW3XROBQHWDC1FSOB";
    req.query.client_secret = "JSBIN5XFUXGXBLNWBESF1QZ1NUGZFENIXJ0KUGA3OXJBGPQK";
    req.query.v = "20131109";
    var sessionID = req.query.sid;
    request({
        qs: req.query,
        url: "https://api.foursquare.com/v2/venues/search"
    }, function(e, r, b) {
        var status = r ? r.statusCode : 400;
        if (typeof b === 'string') b = JSON.parse(b);
        res.json(b, status);
        if (b && b.response && b.response.venues && b.response.venues.length > 0) {

            console.log("SAVING SEARCH")
            var ll = req.query.ll.split(",");
            ll[0] = parseFloat(ll[0]);
            ll[1] = parseFloat(ll[1]);
            var search = new Search({
                geo: [ll[1], ll[0]],
                fsq: b
            })
            console.log(search)
            search.save(function(saveErr){
                if(saveErr) return console.error(saveErr);
                console.log("Search Saved:",search._id)
            })
            dnbReport(search,sessionID,function(){
                console.log("Report Completed")
            })
        }
    });
}

module.exports.cache = function(req, res, next) {
    var ll = req.param("ll").split(',');
    var radius = parseFloat(req.param("radius"))
    ll[0] = parseFloat(ll[0]);
    ll[1] = parseFloat(ll[1]);

    Search.findOne({
        geo: {
            $geoWithin: {
                $center: [
                    [ll[1], ll[0]], radius
                ]
            }
        }
    }, function(err, search) {
        console.log(err)
        if (err) return res.json(err, 500);
        if (!search) return res.json({
            error: {
                msg: "Nothing cached in this area."
            }
        }, 404);
        console.log(search)
        res.json(search)
    });
};