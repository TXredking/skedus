angular.module("skedApp").service("skedAptService", function($http, $q){

	this.getOrgApts = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/" + orgID,
		}).then(function(results){
			// console.log("skedAptService:", results.data);
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	this.getOrgOpenApts = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/" + orgID,
		}).then(function(results){
			var aptResults = results.data
			// console.log("get open apts", results.data);
			for (var i = aptResults.length - 1; i >= 0; i--) {
				if (aptResults[i].status === "booked") {
					aptResults.splice(i, 1);
				}
				else {
					aptResults[i].type = "success";
				}
			}
			// console.log("aptResults:", aptResults);
			dfd.resolve(aptResults);
		});
		return dfd.promise;
	};

	this.getOrg = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/org/" + orgID,
		}).then(function(result){
			dfd.resolve(result.data);
		});
		return dfd.promise;
	};

	this.skedApt = function(aptID, userID){
		var dfd = $q.defer();
		$http({
			method: "PUT",
			url: "/api/apt/" + aptID,
			data: {
				mentee: userID,
				status: "booked",
			}
		}).then(function(){
			dfd.resolve();
		})
		return dfd.promise;
	};

});
