/**
 * RescueMap Module
 *
 * Description
 */
var dnbRescue,dnbRescueMap,initialize,pubnub,startApp;
dnbRescue = angular.module('dnbRescue', ['ui.map']);
dnbRescueMap = angular.module('dnbRescue.ui-map', ['ui.map']);
pubnub = PUBNUB.init({
    // publish_key   : 'pub-c-1b4ca79e-5163-4dd3-92a1-9bdf75aa470f',
    subscribe_key : 'sub-c-c8dfb09e-49cf-11e3-aab4-02ee2ddab7fe'
});
dnbRescue.controller('RecueMapCtrl', ['$scope','api',function($scope,api) {
    console.log("IN CONTROLLER")
    $scope.mapMarkers = [];
    $scope.mapOptions = { 
        zoom: 15,
        center: new google.maps.LatLng(35.784, -78.670),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.searchProgress = {
        percent:0,
        active:false
    }

    $scope.rescueReportRecords = [];

    // fourSquare Category ids
    var catIds = [
        "4d4b7105d754a06374d81259",
        "4e67e38e036454776db1fb3a",
        "4d4b7105d754a06378d81259",
        "4eb1bea83b7b6f98df247e06",
        "4bf58dd8d48988d104941735",
        "50328a8e91d4c4b30a586d6c",
        "4bf58dd8d48988d124941735"
    ];

    $scope.addMarker = function(lat,lng){
        var ll = new google.maps.LatLng(lat,lng);
        $scope.mapMarkers.push(new google.maps.Marker({
            map: $scope.rescueMap,
            position: ll
        }))
    };

    // Get Current GPS Coords
    // navigator.geolocation.getCurrentPosition(function(pos) {
    //     var lat = pos.coords.latitude;
    //     var lng = pos.coords.longitude;
    //     // Wait for 3 seconds then
    //     // pan to mylocation
    //     var myLoc = new google.maps.LatLng(lat,lng);
    //     $scope.addMarker(lat,lng);
    //     // $scope.rescueMap.panTo(myLoc);    
    // });

    $scope.search = function(){
        var o = $scope.searchOpts;
        api.search({
            ll: o ? o.ll : "38.893596,-77.014576",
            limit: o ? o.limit : 50,
            radius: o ? o.radius : 800,
            intent:'browse',
            categoryId:catIds.join(',')
        },function(err,data){
            if(err) return console.warn(err);
        });
    };
    $scope.search();


    // Progress for Map Report
    pubnub.subscribe({
        restore    : true,                                 // FETCH MISSED MESSAGES ON PAGE CHANGES.
        channel : "dnbRescue.progress",
        message : function(message, env, channel){         // RECEIVED A MESSAGE.
            $scope.searchProgress.percent = message.percentComplete;
            $scope.searchProgress.active = true;
            $scope.$apply()
            console.log(message.percentComplete);
        },
        presence   : function( message, env, channel ) {
        }, // OTHER USERS JOIN/LEFT CHANNEL.
        connect    : function() {                          // CONNECTION ESTABLISHED.
            console.log("Connected to socket")
        },
        disconnect : function() {},                        // LOST CONNECTION (OFFLINE).
        reconnect  : function() {}                         // CONNECTION BACK ONLINE!
    })
    
    // New Record From The Report
    pubnub.subscribe({
        restore:true,
        channel:'dnbRescue.newRecord',
        message:function(message){
            console.log(message)
            message.assistMeRating = parseInt(message.VIAB_RAT)
            $scope.rescueReportRecords.push(message);
            var lat = message.location.lat;
            var lng = message.location.lng;
            $scope.addMarker(lat,lng);
            $scope.rescueMap.panTo($scope.mapMarkers[0].getPosition())
            $scope.$apply();
        }
    })

    // Report Completed
    pubnub.subscribe({
        restore:false,
        channel:'dnbRescue.complete',
        message:function(message){
            var total = $scope.rescueReportRecords.length;
            $scope.searchProgress.active = false;
            $scope.searchProgress.percent = 0;
            console.log('Report Generation Complete:',total)
        }
    })


}])

.factory('api',['$http',function($http){
    var api = {
        search:function(opts,cb){
            $http({
                method:"GET",
                url:"/api/v1/foursquare/geo",
                params:opts
            })
            .success(function(data){
                cb(null,data);
            })
            .error(function(err){
                cb(err,err);
            });
        }
    };
    return api;
}])