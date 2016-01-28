angular.module("skedApp").service('aptService', function($http, $q) {

  this.createApt = function(newApt, orgID, userID){
    // console.log("newApt:", newApt.endsAt)
    var dfd = $q.defer();
    $http({
      method: 'POST',
      url: "/api/apt/" + orgID + "/" + userID,
      data: {
        org: orgID,
        mentor: userID,
        startsAt: newApt.startsAt,
        endsAt: newApt.endsAt,
        title: newApt.title,
        loc: newApt.loc
      },
    })
    // .then(function(res){
    //   console.log("res", res)
    //   $http({
    //     method: "PUT",
    //     url: "/api/apt/" + orgID + "/" + userID,
    //     data: newApt
    //   })
      .then(function(){
        dfd.resolve();
      // })
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

  this.removeOpenApt = function(aptID, orgID){
    var dfd = $q.defer();
    $http({
      method: "PUT",
      url: "/api/apt/delete/" + aptID + "/" + orgID,
      data: {
        data: "",
      },
    }).then(function(){
      dfd.resolve();
    })
    return dfd.promise;
  }

});
