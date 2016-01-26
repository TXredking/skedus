angular.module("skedApp").controller("mainCtrl", function($scope, $location, authService, mainService, user, apptRef, allMyAptRef, $state){

  //------------jQuery Stuff-------------------
$(document).ready(function(){

  // auto close sidebar when select an item
  // $('.menuItemSelected').click(function(event) {
  //   console.log('I ran');
  //   $('#navSidebar').offcanvas("hide");
  // });

});
// ------------------------------------------

	$scope.aptView = function(view) {
		switch (view) {
			case "listMode":
				$scope.listMode = true;
				$scope.calendarMode = false;
				$scope.aptRadio = 'Left';
				break;
			case "calendarMode":
				$scope.listMode = false;
				$scope.calendarMode = true;
				$scope.aptRadio = 'Right';
				break;
			default:
				$scope.listMode = true;
				$scope.calendarMode = false;
				$scope.aptRadio = 'Left';
		}
	};
	$scope.aptView('');

	// $scope.$on('calendarMode', function(evt, msg) {
	// 	$scope.aptView(msg);
	// 	console.log("msg", msg);
	// 	console.log('emit');
	// });


	// $scope.calendarLoaded = true;
	// $scope.notLoaded = false;

	// $scope.$on('toggleCalendarLoaded', function(event, toggle) {
	// 	if (toggle === 1) {
	// 		$scope.notLoaded = false;
	// 		$scope.calendarLoaded = true;
	// 	};
	// });

	//Page title
	$scope.pageTitle = "sked";

	$scope.user = user;
	$scope.mainService = mainService;


	$scope.getMyOrgs = function(userID){
		mainService.getMyOrgs(userID).then(function(res){
			$scope.myOrgs = res;
		});
	};
	$scope.getMyOrgs($scope.user._id);

	$scope.getOrgs = function(){
		mainService.getOrgs().then(function(res){
			var orgs = res;
			for(var i = orgs.length - 1; i >= 0 ; i--){
				var members = orgs[i].members;
				for(var j = 0; j < members.length; j++){
					if(members[j].userid === $scope.user._id){
						orgs.splice(i, 1);
					}
				}
			}
			$scope.orgs = orgs;
		})
	}
	$scope.getOrgs();

	$scope.joinOrg = function(org){
		mainService.joinOrg($scope.user._id, org._id).then(function(){
			swal({
				title: "You've successfully joined " + org.name + "!",
				allowEscapeKey: true,
				allowOutsideClick: true,
				timer: 3000,
			})
			$scope.getMyOrgs($scope.user._id);
			$scope.getOrgs();
		})
	};

	$scope.leaveOrg = function(org){
		if(org.role === 'Admin'){
			swal({
				title: "You are an Admin for " + org.org.name + "! We can't have a ship without a captain!",
				type: "error",
				allowEscapeKey: true,
				allowOutsideClick: true,
			})
		} else {
			swal({
				title: "Are you sure you want to leave " + org.org.name + "? You will lose any appointment(s) you currently have scheduled.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
			}, function(isConfirm){
				if(isConfirm){
					mainService.leaveOrg($scope.user._id, org.org._id).then(function(){
						$scope.getMyOrgs($scope.user._id);
						$scope.getMyMenteeBookedApts($scope.user._id);
						console.log("no longer member or org :(");
					});
				};
			});
		}
	};

	$scope.createOrg = function(newOrg){
		if(!newOrg.add1 || !newOrg.city || ! newOrg.st || !newOrg.zip){
			return
		} else {
			mainService.createOrg(newOrg, $scope.user._id).then(function(res){
				if(res === "exists"){
					swal({
						title: "Organization with name " + newOrg.name + " already exists.",
						type: "error",
						allowEscapeKey: true,
						allowOutsideClick: true,
						timer: 4000,
					})
				} else {
					swal({
						title: "You've created " + newOrg.name + "!",
						allowEscapeKey: true,
						allowOutsideClick: true,
						timer: 2000
					})
				$scope.getMyOrgs($scope.user._id);
				$scope.newOrg = {};
				}
			});
		}
	};

	//get all book appointments for a user
	$scope.allMyApts = allMyAptRef;

	$scope.getAllMyApts = function() {
		mainService.getMyBookedApts($scope.user._id).then(function(results) {
			$scope.allMyApts = results;
		});
	};

	//get all mentee booked appointments
	$scope.myMenteeBookedApts = apptRef;

	$scope.getMyMenteeBookedApts = function(userID){
		mainService.getMyMenteeBookedApts(userID).then(function(results){
			$scope.myMenteeBookedApts = results;
			// $scope.$apply();
		});
	};
	// $scope.getMyMenteeBookedApts($scope.user._id);

	$scope.cancelApt = function(aptID){
		swal({
			title: "Are you sure you want to Cancel Appointment?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			cancelButtonText: "No, I want to keep it!",
			allowEscapeKey: true,
			allowOutsideClick: true,
		}, function(isConfirm){
			if(isConfirm){
				mainService.cancelApt(aptID).then(function(){
					$scope.getAllMyApts($scope.user._id);
					$state.reload(true);
				});
			};
		});
	};

	$scope.rescheduleApt = function(aptID, orgID){
		console.log("orgID", orgID)
		swal({
			title: "Are you sure you want to Reschedule Appointment?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			cancelButtonText: "No, I want to keep it!",
			allowEscapeKey: true,
			allowOutsideClick: true,
		}, function(isConfirm){
			if(isConfirm){
				mainService.cancelApt(aptID).then(function($location){
					$scope.getAllMyApts($scope.user._id);
					document.location = "/#/skedApt/" + orgID;
				});
			};
		});
	};

	$scope.showOrgInfo = function(org){
		console.log(org);
		if (!org.desc) {
			org.desc = "None";
		};

		if (!org.add1 && !org.add2 && !org.city && !org.st && !org.zip) {
			org.add1 = "None";
			org.add2 = "";
			org.city = "";
			org.st = "";
			org.zip = "";
		}
		else if (!org.add1) {
			org.add1 = "None";
		}
		else if (!org.add2) {
			org.add2 = "None";
		}
		else if (!org.city) {
			org.city = "None";
		}
		else if (!org.st) {
			org.st = "None";
		}
		else if (!org.zip) {
			org.zip = "None";
		};

		if (!org.linkedin) {
			org.linkedin = "None";
		};
		if (!org.facebook) {
			org.facebook = "None";
		};
		if (!org.twitter) {
			org.twitter = "None";
		};
		swal({
			title: org.name,
			text: "<h4>About: </h4>" + org.desc +
				"<br><h4>Location: </h4>" + org.add1 + " " + org.add2 + " " + org.city + " " + org.st +  " " + org.zip +
				"<br> <h4>LinkedIn Link: </h4>" + org.linkedin +
				"<br> <h4>Facebook Link: </h4>" + org.facebook +
				"<br> <h4>Twitter Link: </h4>" + org.twitter,
			html: true,
			allowEscapeKey: true,
			allowOutsideClick: true,
		})
	}


	$scope.logout = function() {
		authService.logout().then(function() {
			location.reload();
		})
	};


});
