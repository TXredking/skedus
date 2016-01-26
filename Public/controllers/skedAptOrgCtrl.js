angular.module("skedApp").controller("skedAptOrgCtrl", function($scope, $state, skedAptService, orgApptRef){

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

});
