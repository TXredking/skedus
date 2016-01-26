angular.module("skedApp").controller("aptAvailabilityCtrl", function($scope, $state, aptService, mainService){

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

	$scope.aptDurations = [{lenth: '15 Minutes'}, {length: '30 Minutes'}, {length: '45 Minutes'}, {length: '1 Hour'}];

	$scope.getMyOpenApts = function(orgID, userID){
		aptService.getMyOpenApts(orgID, userID).then(function(results){
			$scope.myOpenApts = results;
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
				});
			};
		});
		
	};

});