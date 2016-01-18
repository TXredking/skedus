angular.module("skedApp").service('aptService', function($http, $q) {

  this.createApt = function(newApt, orgID, userID){
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: "/api/apt/" + orgID + "/" + userID,
      data: {
        org: orgID,
        mentor: userID,
        startTime: newApt.startTime,
        endTime: newApt.endTime,
        loc: newApt.loc
      },
    }).then(function() {
      $http({
        method: "PUT",
        url: "/api/apt/" + orgID + "/" + userID,
        data: newApt
      }).then(function(){
        dfd.resolve();
      })
    })
    return dfd.promise;
  };

  this.getMyOpenApts = function(orgID, userID){
    var dfd = $q.defer();
    $http({
      method: "GET",
      url: "/api/apt/" + orgID + "/" + userID + '/open',
    }).then(function(results){
      dfd.resolve(results.data);
    })
    return dfd.promise;
  };

});



