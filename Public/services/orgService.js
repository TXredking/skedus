angular.module("skedApp").service("orgService", function($http, $q){

	this.getOrgUsers = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/org/" + orgID + "/users",
		}).then(function(results){
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	this.getOrg = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/org/" + orgID,
		}).then(function(results){
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	this.getOrgApts = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/" + orgID,
		}).then(function(results){
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	this.getAllOrgApts = function(orgID, userID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/" + orgID,
		}).then(function(results){
			var aptResults = results.data
			// console.log("get all apts", results.data);
			for (var i = aptResults.length - 1; i >= 0; i--) {
				if (aptResults[i].status === "past" || aptResults[i].status === "completed") {
					aptResults.splice(i, 1);
				}
				else {
					if (aptResults[i].mentor._id === userID) {
						aptResults[i].type = "important";
					}
				}
			}
			// console.log("aptResults:", aptResults);
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	this.getAllTheThings = function(orgID, userID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/" + orgID,
		}).then(function(results){
			var aptResults = results.data
			for (var i = aptResults.length - 1; i >= 0; i--) {
				if (aptResults[i].mentor._id === userID) {
					aptResults[i].type = "important";
				}
			}
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	this.updateOrg = function(orgID, updateData){
		var dfd = $q.defer();
		$http({
			method: "PUT",
			url: "/api/org/" + orgID,
			data: updateData
		}).then(function(res){
			dfd.resolve(res.data);
		});
		return dfd.promise;
	};

	this.deactivateOrg = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "PUT",
			url: "/api/org/" + orgID,
			data: {
				status: "Archived"
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.reactivateOrg = function(orgID){
		var dfd = $q.defer();
		$http({
			method: "PUT",
			url: "/api/org/" + orgID,
			data: {
				status: "Active"
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.makeAdmin = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/org/" + orgID + "/admins",
			data: {
				role: "Admin",
				userid: userID,
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.makeMentor = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/org/" + orgID + "/mentors",
			data: {
				role: "Mentor",
				userid: userID,
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.makeUser = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/org/" + orgID + "/user",
			data: {
				role: "User",
				userid: userID,
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.removeUser = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "PUT",
			url: "/api/org/" + orgID + "/users",
			data: {userid: userID}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.blockUser = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/org/" + orgID + "/user",
			data: {
				role: "Blocked",
				userid: userID,
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	this.unblockUser = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/org/" + orgID + "/user",
			data: {
				role: "User",
				userid: userID,
			}
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};


});
