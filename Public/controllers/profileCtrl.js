angular.module("skedApp").controller("profileCtrl", function($scope, $state, userService){

	//spinning loading animation
	$scope.stuffLoaded = false;
	$scope.notLoaded = true;

	var getUser = function(userID){
 		userService.getUser(userID).then(function(res){
  			$scope.user = res;

				//cancels circle spinner and unhide loaded view
				$scope.stuffLoaded = true;
				$scope.notLoaded = false;
  		})
  	};

	$scope.updateUser = function(userID){
  		userService.updateUser($scope.user._id, $scope.userUpdates).then(function(){
	 		userService.getUser($scope.user._id).then(function(res){
  				$scope.userUpdates = "";
	  			return $scope.user = res;
	  		})
  		});
  	};

	$scope.deactivateUser = function(userID){
		swal({
			title: "Are you sure you want to deactivate your account?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Deactivate",
			cancelButtonText: "Cancel",
		}, function(isConfirm){
			if(isConfirm){
				userService.deactivateUser(userID).then(function(){
					getUser($scope.user._id);
				});
				$state.go("login");
			};
		});
	};


});
