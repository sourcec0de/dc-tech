var mongoose = require('mongoose');

// Initialize Model Schema's
var searchSchema = mongoose.Schema({
    geo: {
        type: [Number],
        index: '2d',
        required:true
    },
    fsq: {
        type:Object,
        required:true
    },
    duns: {
        type:Array,
        default:[]
    }
});

module.exports = function(app) {
    return mongoose.model('AdminUser', searchSchema)
}

// {​
//     loc: {
//         $geoWithin: {
//             $center: [
//                 [-122.9729539, 44.9895253], .02 // [[lng, lat], radius] ZEROES in on ZIP CODE
//             ]
//         }
//     }
// }