/**
 * dnb api Module
 *
 * Description
 */
var fs = require('fs');
var request = require("request");
module.exports = function(auth, maxRetires,authFile) {
    
    var auth = auth || null;
    var maxRetires = maxRetires || 2;
    var url = "https://maxcvservices.dnb.com";
    var authFile = authFile || null;
    var Authorization = fs.readFileSync(authFile, 'utf8') || null;
    var mobileUrl = "http://ilabs.api.mashery.com/mobile-api-web/rest/api/1.0.0";
    var mobileApiKey = "dwm7aqetzrwyq9evwz4yvmsb";
    var mobileApiAuth = "Basic SGFja2F0aG9uOndlbGNvbWUxMjM=";
    var dnb = {
        
        mobileApi:function(opts,cb){
            var reqOptions, reqCompleted;
            var retires = maxRetires;
            var headers = opts.headers || {};
            var params = opts.params || {};
            params.api_key = mobileApiKey;
            headers.Authorization = mobileApiAuth;
            reqOptions = {
                url: mobileUrl + opts.endpoint,
                qs: opts.params || void 0,
                method: opts.method || void 0,
                body: opts.body || void 0,
                json: opts.json || void 0,
                headers: headers
            };
            dnb.req(reqOptions,function(err,data){
                if(data){
                    data.body = (data && typeof data.body === 'string')? JSON.parse(data.body):data.body;
                }
                cb(err,data)
            });
        },

        /**
         * @param opts {Object}
         *  opts.endpoint {String} uri of the endpoint
         *  opts.headers {Object} HTTP Headers
         *  opts.params {Object} QueryString
         *  opts.method {String} GET,PUT,POST,DELETE,HEAD,OPTIONS
         *  opts.body {String} Text of req body
         *  opts.json {Object} Sets Content-Type: applicaiton/json and send obj as body
         * 
         * @param cb {Function} callback returns err ({Object},data {Object})
         */
        api: function(opts, cb) {
            var reqOptions, reqCompleted;
            var retires = maxRetires;
            var headers = opts.headers || {};
            headers.Authorization = Authorization;
            reqOptions = {
                url: url + opts.endpoint,
                qs: opts.params || void 0,
                method: opts.method || void 0,
                body: opts.body || void 0,
                json: opts.json || void 0,
                headers: headers
            };

            // Process Completed Request
            reqCompleted = function(err, data) {
                // If request ! Authorized
                if (err && err.status == 401 && retires > 0) {

                    retires--;
                    // Reauthorize
                    dnb.authorize(function() {
                        // fire request again
                        dnb.req(reqOptions, reqCompleted);
                    });

                    // if err and can still retry
                } else if (err && retires > 0) {

                    retires--;
                    dnb.req(reqOptions, reqCompleted);

                    // If err and no retries left
                } else if (err && retires == 0) {

                    cb(err, data);

                    // success
                } else if(data){
                    data.body = (data && typeof data.body === 'string')? JSON.parse(data.body):data.body;
                    cb(err, data);
                }

                return void 0;
            };

            // Fire Initial Req
            dnb.req(reqOptions, reqCompleted);
        },
        authorize: function(cb) {
            var endpoint = "/rest/Authentication";
            dnb.req({
                url: url + endpoint,
                method: "POST",
                headers: auth
            }, function(e, d) {
                if (!e) Authorization = d.headers.authorization;
                fs.writeFile(authFile, Authorization, function(saveErr) {
                    if (saveErr) throw saveErr;
                    console.log(saveErr)
                    cb(e, d, Authorization);
                });
            });
        },
        req: function(opts, cb) {   
            request(opts, function(e, r, b) {
                var status = r ? r.statusCode : null;
                var statusOK = !(status >= 400);
                var resData = {
                    response: r,
                    status: status,
                    headers: r ? r.headers : null,
                    body: b
                };
                // Check Status and respond
                if (statusOK) {
                    cb(null, resData);
                } else {
                    cb(resData, null);
                };
            });
        }
    }
    return dnb;
}