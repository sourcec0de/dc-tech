/**
 * RescueMap Module
 *
 * Description
 */

dnbRescue.controller('RecueMapCtrl', ['$scope','api',function($scope,api) {
    $scope.mapMarkers = [];
    $scope.mapOptions = { 
        zoom: 15,
        center: new google.maps.LatLng(35.784, -78.670),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

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
    }

    // Get Current GPS Coords
    navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        // Wait for 3 seconds then
        // pan to mylocation
        var myLoc = new google.maps.LatLng(lat,lng);
        $scope.addMarker(lat,lng);
        $scope.rescueMap.panTo(myLoc);    
    });

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
            var venues = data.response.venues;
            venues.forEach(function(v){
                var lat = v.location.lat;
                var lng = v.location.lng;
                $scope.addMarker(lat,lng);
            });
        });
    };
    $scope.search()
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
                cb(err,data);
            });
        }
    };
    return api;
}])