angular.module("skedApp").controller("skedAptOrgCtrl", function($scope, $state, skedAptService, orgApptRef){

	//spinning loading animation
	$scope.stuffLoaded = false;
	$scope.notLoaded = true;

	// $scope.orgApts = orgApptRef;

	// $scope.getOrgApts = function(orgID){
	// 	skedAptService.getOrgApts(orgID).then(function(results){
	// 		$scope.orgApts = results;
	// 	});
	// };
	// $scope.getOrgApts($state.params.id);


	$scope.getOrgOpenApts = function(orgID){
		skedAptService.getOrgOpenApts(orgID).then(function(results){
			console.log("results", results)
			$scope.orgApts = results;

			//cancels circle spinner and unhide loaded view
			$scope.stuffLoaded = true;
			$scope.notLoaded = false;
		});
	};
	$scope.getOrgOpenApts($state.params.id);

	$scope.getOrg = function(orgID){
		skedAptService.getOrg(orgID).then(function(result){
			$scope.thisOrg = result;
		});
	};
	$scope.getOrg($state.params.id);

	$scope.skedApt = function(apt){
		skedAptService.skedApt(apt._id, $scope.user._id).then(function(){
			swal({
				title: "You've successfully scheduled your appointment with " + apt.mentor.firstName + " " + apt.mentor.lastName + "!",
				allowEscapeKey: true,
				allowOutsideClick: true,
				timer: 3000,
			});
			$scope.getOrgOpenApts($state.params.id);
			$scope.getAllMyApts($scope.user._id);
		});
	};

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
