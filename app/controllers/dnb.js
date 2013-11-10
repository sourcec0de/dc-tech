var DNB = require(__root_path + '/libs/dnb.js');
var authFile = __root_path + '/config/.auth';
var maxRetries = 0;
var dnb = new DNB(__gapps.dnb, maxRetries, authFile)

module.exports.index = function(req, res, next) {
    res.render('map')
}

module.exports.search = function(req, res, next) {
    

    if (req.param("q")) {
        // Search DNB
        dnb.api({
            method: "GET",
            endpoint: "/V4.0/organizations",
            params: {
                match: true,
                SubjectName: req.param("q"),
                MatchTypeText: "Advanced",
                CountryISOAlpha2Code: "US"
            }
        }, function(err, data) {
            // console.log(data? data.body:null)
            var viewData = {};
            if (data) {
                var r = data.body;
                var candidates = r.MatchResponse.MatchResponseDetail.MatchCandidate
                viewData.candidates = candidates
            } else if (err) {
                viewData.errors = err
                res.status(err.status)
            }
            res.render("search", viewData);

        });

    }else{
        res.status(400)
        res.render("search")
    }
}