var DNB = require('../dnb.js');
var maxRetries = 0;
var authFile = '../.auth';
var log = console.log

var dnb = new DNB({
    'x-dnb-user': 'hackathon1@dnb.com',
    'x-dnb-pwd': 'Hackathon123'
}, maxRetries, authFile)


// Authorize Overrite Auth File
// dnb.authorize(function(err,data,auth){
//     if(!auth) console.error(err,data);
// })



// CountryISOAlpha2Code=US&SubjectName=nutritionix&match=true&MatchTypeText=Advanced
dnb.api({
    method: "GET",
    endpoint: "/V4.0/organizations",
    params: {
        match: true,
        SubjectName: "nutritionix",
        MatchTypeText: "Advanced",
        CountryISOAlpha2Code: "US"
    }
}, function(err, data) {
    // console.log(data? data.body:null)
    if (data) {
        var r = data.body;
        var candidates = r.MatchResponse.MatchResponseDetail.MatchCandidate
        candidates.forEach(function(c) {
            getVIAB_RAT(c.DUNSNumber)
        });
    }
});


var getVIAB_RAT = function(duns) {
    dnb.api({
        method: "GET",
        endpoint: "/V3.0/organizations/" + duns + "/products/VIAB_RAT",
    }, function(err, data) {
        // console.log(data? data.body:null)
        if (data) {
            var r = data.body;
            console.log(r)
        }
    });
}