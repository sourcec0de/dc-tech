module.exports = {
  version: 1,
  baseUri: "/api/v1",
  policies: [],
  resources: {
    foursquare: {
      uri: "/foursquare",
      policies: [],
      endpoints: {
        "/geo": {
          controller: "geo",
          policies: [],
          method: "get",
          params: {}
        },
        "/cache": {
          controller: "cache",
          policies: [],
          method: "get",
          params: {
            ll:{
              is: {
                args: [new RegExp("[0-9.-]+,[0-9.-]+")],
                msg: "must match /[0-9.-]+,[0-9.-]+/"
              }
            },
            radius:{
              isNumeric:{
                args:[],
                mgs: "must be numeric value"
              }
            }
          }
        }
        // "/:duns"
      }
    },
    dnb: {
      uri: "/dnb",
      policies: [],
      endpoints: {
        "/geo": {
          controller: "geo",
          policies: [],
          method: "get",
          params: {
            // Query
            // q: {
            //   notEmpty: {
            //     args: null,
            //     msg: "cannot be empty"
            //   }
            // }
          }
        }
        // "/:duns"
      }
    }
  }
}



// Example endpoints"/:id": {
// controller: "show",
// method: "get",
// policies: [],
// params: {
//   upc: {
//     notEmpty: {
//       args: null,
//       msg: "cannot be empty"
//     },
//     isInt: {
//       args: null,
//       msg: "must be a valid integer"
//     },
//     len: {
//       args: [6, 12],
//       msg: "must have between 6 and 12 chars"
//     },
//     isIn: {
//       args: [
//         [123456]
//       ],
//       msg: "must be one of [123456]"
//     }
//   }
// }
// }