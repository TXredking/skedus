angular.module("skedApp").service("mainService", function($http, $q){

	// gets specific users orgs and their role within each org
	this.getMyOrgs = function(userID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/user/" + userID + "/orgs",
		}).then(function(res){
			myOrgs = res.data;
			dfd.resolve(myOrgs);
		});
		return dfd.promise;
	};

	//get all orgs that a user is not a part of and could join
	this.getOrgs = function(){
		var dfd = $q.defer()
		$http({
			method: "GET",
			url: "api/orgs",
		}).then(function(res){
			orgs = res.data;
			dfd.resolve(orgs);
		})
		return dfd.promise;
	};

	//adds user to the members array of a specific org with role of "User"
	this.joinOrg = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/org/" + orgID + "/users",
			data: {
				userid: userID,
				role: "User",
			},
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};

	//removes user to the members array of a specific org
	this.leaveOrg = function(userID, orgID){
		var dfd = $q.defer();
		$http({
			method: "PUT",
			url: "/api/org/" + orgID + "/users",
			data: {
				userid: userID
			},
		}).then(function(){
			dfd.resolve();
		})
		return dfd.promise;
	};

	//creates a new org and sets the user that created it to an admin role
	this.createOrg = function(newOrg, userID){
		var dfd = $q.defer();
		$http({
			method: "POST",
			url: "/api/orgs/" + userID,
			data: newOrg
		}).then(function(res){
			dfd.resolve(res.data);
		})
		return dfd.promise;
	};

	//gets any appointments the user has booked
	this.getMyBookedApts = function(userID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/all/" + userID + "/booked",
		}).then(function(results){
			console.log("service results:", results.data);
			console.log("user:", userID);
			for (var i = 0; i < results.data.length; i++) {
				if (results.data[i].mentor._id === userID) {
					results.data[i].type = "important";
					results.data[i].deletable = true;
				}
				else {
					results.data[i].type = "info";
					results.data[i].deletable = true;
				}
			}
			// console.log("mentorbookApt",results);
			dfd.resolve(results.data);
		});
		return dfd.promise;
	};

	//gets any appointments the user has booked
	this.getMyMenteeBookedApts = function(userID){
		var dfd = $q.defer();
		$http({
			method: "GET",
			url: "/api/apt/" + userID + "/booked",
		}).then(function(results){
			// console.log("service results:", results.data);
			// console.log("user:", userID);
			for (var i = 0; i < results.data.length; i++) {
				if (results.data[i].mentor._id === userID) {
					results.data[i].type = "important";
					// results.data[i].deletable = true;
				}
				// else {
				// 	results.data[i].type = "info";
				// 	results.data[i].deletable = true;
				// }
			}
			dfd.resolve(results.data);
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

	//mentee cancels apt and returns it to be available to be booked again
	this.cancelApt = function(aptID){
		var dfd = $q.defer();
		$http({
			method: "PATCH",
			url: "/api/apt/cancel/" + aptID,
			data: {
				mentee: "",
				status: "open",
			},
		}).then(function(){
			dfd.resolve();
		});
		return dfd.promise;
	};










});
