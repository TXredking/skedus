angular.module("skedApp").controller("orgCtrl", function($scope, orgService, user, $state){

	$scope.getOrgUsers = function(orgID){
		orgService.getOrgUsers(orgID).then(function(results){
			$scope.orgUsers = results;
		})
	};
	$scope.getOrgUsers($state.params.id);

	var getOrg = function(orgID){
		orgService.getOrg($state.params.id).then(function(results){
			$scope.currentOrg = results;
		})
	};
	getOrg($state.params.id);

	$scope.showUserInfo = function(user){
		swal({
			title: user.firstName + " " + user.lastName,
			text: "<h4>About: </h4>" + user.desc +
				"<br> <h4>Company: </h4>" + user.company + 
				"<br> <h4>Job Title: </h4>" + user.title +
				"<br> <h4>Specialities: </h4>" + user.specialities +
				"<br> <h4>LinkedIn: </h4>" + user.linkedin +
				"<br> <h4>Facebook: </h4>" + user.facebook +
				"<br> <h4>Twitter: </h4>" + user.twitter,
			html: true,
			allowEscapeKey: true,
			allowOutsideClick: true,
		})
	}

});