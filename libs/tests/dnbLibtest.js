var fs = require('fs');
var DNB = require('../dnb.js');
var maxRetries = 1;
var authFile = __root_path + '/config/auth.dnb';
var log = console.log
var Queue = require('queue3');
var q = new Queue({
    concurrency: 3,
    timeout: 10000
});
// var fsq = fs.readFileSync('./exampleFSRES.json', 'utf8');
var events = require('events');
var util = require('util');
var pubnub = require("pubnub").init({
    publish_key: 'pub-c-1b4ca79e-5163-4dd3-92a1-9bdf75aa470f',
    subscribe_key: 'sub-c-c8dfb09e-49cf-11e3-aab4-02ee2ddab7fe'
});


var Job = function() {
    events.EventEmitter.call(this);
};
util.inherits(Job, events.EventEmitter);
job = new Job()



// fsq = JSON.parse(fsq);

var dnb = new DNB({
    'x-dnb-user': 'hackathon9@dnb.com',
    'x-dnb-pwd': 'Hackathon123$'
}, maxRetries, authFile)
// dnb.authorize(function(err,data,auth){
//     if(auth) console.error(auth);
// })


module.exports = function(search,sessionID,finishedCB) {


    var companies = search.fsq.response.venues;
    var percet = [0, companies.length];
    companies.forEach(function(company) {
        q.push(function(fn) {
            var mappedRecord = {
                id: company.id,
                name: company.name,
                contact: company.contact,
                location: company.location,
                verified: company.verified,
                restricted: company.restricted,
                stats: company.stats,
                url: company.url,
                duns: null,
                VIAB_RAT: null,
                // size:null
            };
            // console.log(name, phone, zip)
            dnb.api({
                method: "GET",
                endpoint: "/V4.0/organizations",
                params: {
                    match: true,
                    SubjectName: company.name,
                    TelecommunicationNumber: company.contact.formattedPhone,
                    FullPostalCode: company.location.postalCode,
                    MatchTypeText: "Advanced",
                    CountryISOAlpha2Code: "US"
                }
            }, function(err, data) {
                percet[0]++;
                job.emit('progress', {
                    total: percet[1],
                    completed: percet[0],
                    inProgress: (percet[1] - percet[0]),
                    percentComplete: parseInt((percet[0] / percet[1]) * 100)
                });
                if (data) {
                    var r = data.body;
                    var candidates = r.MatchResponse.MatchResponseDetail.MatchCandidate;
                    if (candidates.length > 0) {
                        var duns = candidates[0].DUNSNumber;
                        mappedRecord.duns = duns;
                        dnb.api({
                            method: "GET",
                            endpoint: "/V3.0/organizations/" + duns + "/products/VIAB_RAT",
                        }, function(err, data) {
                            if (data) {
                                var r = data.body;
                                mappedRecord.VIAB_RAT = r.OrderProductResponse.OrderProductResponseDetail.Product.Organization.Assessment.DNBViabilityRating.DNBViabilityRating
                                // mappedRecord.size = OrderProductResponse.OrderProductResponseDetail.Product.Organization.Assessment.DNBViabilityRating.OrganizationProfileDetail.OrganizationSizeDetail.OrganizationSizeCategoryText
                            }
                            fn()
                            job.emit('newRecord', mappedRecord)
                            if (percet[0] == percet[1]) job.emit('complete');
                        });
                    }
                } else {
                    fn()
                    job.emit('newRecord', mappedRecord)
                    if (percet[0] == percet[1]) job.emit('complete');
                }
            });
        });
    });

    job.on('progress', function(data) {
        var ch = "dnbRescue.progress."+sessionID;
        console.log(ch)
        pubnub.publish({
            channel: ch,
            message: data
        })
    });

    job.on('newRecord', function(record) {
        if(record.VIAB_RAT !== null){
            var ch = "dnbRescue.newRecord."+sessionID;
            console.log(ch)
            pubnub.publish({
                channel: ch,
                message: record
            });
        }
    });

    job.on("complete", function() {
        var ch = "dnbRescue.complete."+sessionID;
        console.log(ch)
        pubnub.publish({
            channel: ch,
            message: "completed"
        });
        finishedCB()
    });

}

// Authorize Overrite Auth File
// dnb.authorize(function(err,data,auth){
//     if(!auth) console.error(err,data);
// })



// CountryISOAlpha2Code=US&SubjectName=nutritionix&match=true&MatchTypeText=Advanced
// dnb.api({
//     method: "GET",
//     endpoint: "/V4.0/organizations",
//     params: {
//         match: true,
//         SubjectName: "nutritionix",
//         MatchTypeText: "Advanced",
//         CountryISOAlpha2Code: "US"
//     }
// }, function(err, data) {
//     // console.log(data? data.body:null)
//     if (data) {
//         var r = data.body;
//         var candidates = r.MatchResponse.MatchResponseDetail.MatchCandidate
//     }
// });


// var getVIAB_RAT = function(duns) {
// dnb.api({
//     method: "GET",
//     endpoint: "/V3.0/organizations/" + duns + "/products/VIAB_RAT",
// }, function(err, data) {
//     // console.log(data? data.body:null)
//     if (data) {
//         var r = data.body;
//         console.log(r)
//     }
// });
// }