angular.module("skedApp").controller("orgManagementCtrl", function($scope, $state, orgService){

	$scope.stuffLoaded = false;
	$scope.notLoaded = true;

	$scope.getOrgUsers = function(orgID){
		orgService.getOrgUsers(orgID).then(function(results){
			console.log("results:", results)
			$scope.orgUsers = results;
			$scope.stuffLoaded = true;
			$scope.notLoaded = false;
		})
	};
	$scope.getOrgUsers($state.params.id);

	var getOrg = function(orgID){
		orgService.getOrg($state.params.id).then(function(results){
			var numAdmins = 0,
				numMentors = 0,
				numUsers = 0,
				members = results.members;
			for(var i = 0; i < members.length; i++){
				if(members[i].role === "Admin"){
					numAdmins ++;
				} else if(members[i].role === "Mentor" ){
					numMentors++;
				} else {
					numUsers++
				}
			}
			results.numAdmins = numAdmins;
			results.numMentors = numMentors;
			results.numUsers = numUsers;
			$scope.currentOrg = results;
		})
	};
	getOrg($state.params.id);

	$scope.getOrgApts = function(orgID){
		orgService.getOrgApts(orgID).then(function(results){
			numOpen = 0,
			numBooked = 0,
			numCompleted = 0,
			numPast = 0;
			for(var i = 0; i < results.length; i ++){
				if(results[i].status === "open"){
					numOpen ++;
				} else if(results[i].status === "booked" ){
					numBooked++;
				} else if(results[i].status === "completed" ){
					numCompleted++;
				} else {
					numPast++
				}
			}
			results.open = numOpen;
			results.booked = numBooked;
			results.completed = numCompleted;
			results.past = numPast;
			$scope.orgApts = results;
			console.log("orgApts: ", $scope.orgApts)
		});
	};
	$scope.getOrgApts($state.params.id);

	$scope.updateOrg = function(){
		orgService.updateOrg($state.params.id, $scope.orgUpdateData).then(function(res){
			if(res === "exists"){
				return swal({
					title: "Organization name already exists.",
					text: "Please try again.",
					type: "error",
					allowEscapeKey: true,
					allowOutsideClick: true,
				});
			};
			$scope.getMyOrgs($scope.user._id);
			$scope.orgUpdateData = "";
			return getOrg($state.params.id);
		});
	};

	$scope.deactivateOrg = function(orgID){
		swal({
			title: "Are you sure you want to deactivate organization?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Deactivate",
			cancelButtonText: "Cancel",
		}, function(isConfirm){
			if(isConfirm){
				orgService.deactivateOrg(orgID).then(function(){
					$scope.getMyOrgs($scope.user._id);
					$state.go("auth.myHome");
				});
			};
		});
	};

	$scope.makeAdmin = function(userID, userRole){
		if(userRole === "Admin"){
			return;
		} else if(userRole === "Mentor"){
			swal({
				title: "Are you sure you want to make this user an admin? They will have access to Organization Management.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Confirm",
				cancelButtonText: "Cancel",
				},
				function(isConfirm){
					if(isConfirm){
						orgService.makeAdmin(userID, $state.params.id).then(function(){
							$scope.getOrgUsers($state.params.id);
							getOrg($state.params.id);
						});
					};
				}
			);
		} else if(userRole === "User"){
			swal({
				title: "Are you sure you want to make this user an admin? They will have access to Organization Management and Set Availability.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Confirm",
				cancelButtonText: "Cancel",
				},
				function(isConfirm){
					if(isConfirm){
						orgService.makeAdmin(userID, $state.params.id).then(function(){
							$scope.getOrgUsers($state.params.id);
							getOrg($state.params.id);
						});
					};
				}
			);
		}
	};

	$scope.makeMentor = function(userID, userRole){
		if(userRole === "Admin"){
			swal({
			title: "Are you sure you want to make this user a Mentor? They will no longer have access to Organization Management",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Confirm",
			cancelButtonText: "Cancel",
			},
			function(isConfirm){
				if(isConfirm){
					orgService.makeMentor(userID, $state.params.id).then(function(){
						$scope.getOrgUsers($state.params.id);
						getOrg($state.params.id);
					});
				};
			});
		} else if(userRole === "User"){
			swal({
			title: "Are you sure you want to make this user a Mentor? They will have access to Set Availability.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Confirm",
			cancelButtonText: "Cancel",
			},
			function(isConfirm){
				if(isConfirm){
					orgService.makeMentor(userID, $state.params.id).then(function(){
						$scope.getOrgUsers($state.params.id);
						getOrg($state.params.id);
					});
				};
			});
		}
	};

	$scope.makeUser = function(userID, userRole){
		if(userRole === "Admin"){
			swal({
			title: "Are you sure you want to make this user a User? They will no longer have access to Organization Management and Set Availability.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Confirm",
			cancelButtonText: "Cancel",
			},
			function(isConfirm){
				if(isConfirm){
					orgService.makeUser(userID, $state.params.id).then(function(){
						$scope.getOrgUsers($state.params.id);
						getOrg($state.params.id);
					});
				};
			});
		} else if(userRole === "Mentor"){
			swal({
			title: "Are you sure you want to make this user a User? They will no longer have access to Set Availability.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Confirm",
			cancelButtonText: "Cancel",
			},
			function(isConfirm){
				if(isConfirm){
					orgService.makeUser(userID, $state.params.id).then(function(){
						$scope.getOrgUsers($state.params.id);
						getOrg($state.params.id);
					});
				};
			});
		}

	};

	$scope.removeUser = function(userID){
		swal({
			title: "Are you sure you want to remove user?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Remove",
			cancelButtonText: "Cancel",
		}, function(isConfirm){
			if(isConfirm){
				orgService.removeUser(userID, $state.params.id).then(function(){
					$scope.getOrgUsers($state.params.id);
				})
			};
		});
	};

	$scope.showInfo = function(user){
		swal({
			title: user.firstName + " " + user.lastName,
			text: "<h4>About: </h4>" + user.desc +
				"<br>" + 
				" <h4>Company: </h4>" + user.company + 
				"<br> <h4>Job Title: </h4>" + user.title +
				"<br> <h4>Specialities: </h4>" + user.specialities +
				"<br> <h4>Social Media: </h4>" + user.socialMedia,
			html: true,
			allowEscapeKey: true,
			allowOutsideClick: true,
		})
	}

});
