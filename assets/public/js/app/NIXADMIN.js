'use strict';
/**
* Admin Module
*
* Description
*/
angular.module('Admin', [])
.config(['$locationProvider',function($locationProvider){
  $locationProvider.html5Mode(false)
  // $locationProvider.hashPrefix("*")
}])
// items
.controller('XhttpCtrl',['$scope','xhttp' ,function($scope,xhttp){
  // Fires when ever
  // update is called
  $scope.xhttp = {
    title:"Loading ...",
    icon:"refresh",
    type:"success",
    message:null
  };

  xhttp.setCB(function(msg){
    for(var key in msg){
      $scope.xhttp[key] = msg[key];
    }
  });
}])


// items
.controller('ItemsCtrl',['$scope',"$location",'xhttp','api',function($scope,$location,xhttp,api){
  $scope.items = items;
  $scope.total = total;
  $scope.size = size;
  $scope.searchParams = {
    "from": 0,
    "size": $scope.size,
    "query":query,
    "filterField":null,
    "filterValue":null
  }

  $scope.search = function() {
    // Get Items
    $location.search("query", $scope.searchParams.query)
    xhttp.show();
    api.exec({
      url: "/a/items",
      method: "GET",
      params: $scope.searchParams
    }, function(err, data) {
      $scope.total = data.total;
      $scope.items = data.hits;
      xhttp.hide()
    })
  }
}])

.controller('ItemCtrl',['$scope','xhttp','api', function($scope,xhttp,api){
  $scope.item = item;

  // USDA Specifics
  if(item && item.remote_db_id == 3){
    $scope.usda = true;
    $scope.updateURL="/admin/items/updateAll";
    $scope.updateMethod="POST";
    item.item_name = item.item_name.split("-")[0].trim();
  }


  $scope.tagChange = function(a,b,c){
    // console.log("TAGCHANGE",a,b,c)
  }

  // Get Items
  $scope.save = function() {
    xhttp.update({
      title:"Saving ..."
    });

    var update = {
      item_name: $scope.item.item_name,
      keywords: $scope.item.keywords,
      indexed: $scope.item.indexed,
      deleted: $scope.item.deleted
    };

    // decipher payload
    var payload = ($scope.usda) ? {
      "showItems":true,
      "query": {
        remote_db_id: 3,
        remote_db_key: $scope.item.remote_db_key
      },
      "update": update
    } : update;

    api.exec({
      url: ($scope.usda)? $scope.updateURL : ("/admin/items/"+item._id),
      method: ($scope.usda)? $scope.updateMethod : "PUT",
      data: payload
    }, function(err, data) {
      if(err) console.warn(err);
      xhttp.update({title:"Succesfully Saved!"}).showFor()
      console.log(data)
    });
  }

}])


.directive('tagInput',[function(){
  return {
    scope:{
      tiAutoValues:'=', // two way value binding
      tiOnAddTag:'&', // function binding
      tiOnRemoveTag:'&',
      tiOnChange:'&',
      tiModel:'='
    },
    restrict:'A', // Attrs only cannot be elm <tag-input></tag-input>
    link:function($scope,iElm,iAttrs){
      iElm.tagsInput({
        'autocomplete_url': iAttrs.tiAutoUrl || void 0,
        'autocomplete': $scope.tiAutoValues || void 0,
        'height': iAttrs.tiHeight || void 0,
        'width':iAttrs.tiWidth || void 0,
        'interactive': iAttrs.tiInteractive || void 0,
        'defaultText': iAttrs.tiDefaultText || void 0,
        'removeWithBackspace': iAttrs.removeWithBackspace || void 0,
        'minChars': iAttrs.tiMinChars || void 0,
        'maxChars': iAttrs.tiMaxChars || void 0, //if not provided there is no limit
        'placeholderColor': iAttrs.tiPlaceHolderColor || void 0,
        onAddTag:function(t){
          $scope.tiModel.push(t);
          $scope.tiOnAddTag(arguments);
          $scope.$apply();
        },
        onRemoveTag:function(t){
          var index = $scope.tiModel.indexOf(t);
          $scope.tiModel.splice(index,1);
          $scope.tiOnRemoveTag(arguments);
          $scope.$apply();
        },
        onChange: function(){
          $scope.tiOnChange(arguments)
        }
      }).importTags($scope.tiModel.join(","))
    }
  }
}])

.factory('api',['$http',function($http){
  // Request helper
  // follows err,Callback signature
  var req = function(opts,cb){
    if(!opts.headers) opts.headers = {};
    opts.headers['X-Requested-With'] = 'XMLHttpRequest';
    $http(opts).success(function(d, s, h, c){
      cb(null,d,s,h,c);
    }).error(function(e, s, h, c){
      cb(e,null,s,h,c);
    })
  };

  return {
    exec:req
  }

}])


// XHHTP Loading Service.
// fire off when loading
// to display data
.factory('xhttp',[function(){
  var xhttp = $("#xhttp");
  var callback = null;
  var visible = null;
  var defTOMs = 500;
  var x = {
    hide:function(){
      visible = false;
      xhttp.hide();
      return x; // return self to chain
    },
    show:function(){
      visible = true;
      xhttp.show();
      return x;
    },
    setCB:function(cb){
      callback = cb;
      return x;
    },
    update:function(msg){
      callback(msg);
      if(!visible) x.show();
      return x;
    },
    showFor:function(ms,cb){
      if(!visible) x.show();
      if(!ms) ms = defTOMs;
      var timeOut = setTimeout(function(){
        x.hide();
        // fires when no longer visible
        if(cb instanceof Function) cb();
      },ms)
    }
  };

  return x;
}])