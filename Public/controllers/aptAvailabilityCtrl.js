angular.module("skedApp").controller("aptAvailabilityCtrl", function($scope, $state, aptService, mainService, skedAptService, allOrgApptRef){

	//spinning loading animation
	$scope.stuffLoaded = false;
	$scope.notLoaded = true;

	// get all organization appointments part
	$scope.allOrgApts = allOrgApptRef;

	$scope.getOrg = function(orgID){
    skedAptService.getOrg(orgID).then(function(result){
      $scope.thisOrg = result;
    });
  };
  $scope.getOrg($state.params.id);

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

	// create and delete appointments part
	$scope.createApt = function(newApt, orgID, userID){
        // console.log(new Date(moment($('#datetimepicker6').data("DateTimePicker").date()).toDate()));
        $scope.newApt.startsAt = new Date(moment($('#datetimepicker6').data("DateTimePicker").date()).toDate());
        switch($scope.newApt.endsAt){
            case "15 Minutes":
                $scope.newApt.endsAt = new Date( moment($('#datetimepicker6').data("DateTimePicker").date()).add(15, "minutes").toDate());
                break;
            case "30 Minutes":
                $scope.newApt.endsAt = new Date(moment($('#datetimepicker6').data("DateTimePicker").date()).add(30, "minutes").toDate());
                break;
            case "45 Minutes":
                $scope.newApt.endsAt = new Date(moment($('#datetimepicker6').data("DateTimePicker").date()).add(45, "minutes").toDate());
                break;
            case "1 Hour":
                $scope.newApt.endsAt = new Date(moment($('#datetimepicker6').data("DateTimePicker").date()).add(1, "hour").toDate());
                break;
        }
        aptService.createApt($scope.newApt, $state.params.id, userID).then(function(){
            $scope.newApt = ''
            $scope.getMyOpenApts($state.params.id, $scope.user._id);
        });
    };

	$scope.getMyOpenApts = function(orgID, userID){
		aptService.getMyOpenApts(orgID, userID).then(function(results){
			$scope.myOpenApts = results;

			//cancels circle spinner and unhide loaded view
			$scope.stuffLoaded = true;
			$scope.notLoaded = false;
		});
	};
	$scope.getMyOpenApts($state.params.id, $scope.user._id);

	$scope.removeOpenApt = function(aptID){
		swal({
			title: "Are you sure you want to Remove Appointment?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes",
			cancelButtonText: "Keep it!",
			allowEscapeKey: true,
			allowOutsideClick: true,
		}, function(isConfirm){
			if(isConfirm){
				aptService.removeOpenApt(aptID, $state.params.id).then(function(){
					$scope.getMyOpenApts($state.params.id, $scope.user._id)
					$state.reload(true);
				});
			};
		});

	};

});
