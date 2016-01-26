angular.module('skedApp').directive('calendarDirective', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      apt: "=",
      updated: "&"
    },
    templateUrl: '/templates/calendarDirective.html',
    // link: function(scope, elem, attrs) {
      // $timeout(function() {
      //   scope.$emit('toggleCalendarLoaded', 1);
      // });
    // },
    controller: function($scope, mainService, $state) {

      // console.log("user", $scope.$parent.$parent.user);
      // console.log("scope", $scope);
      
      // $scope.getMyMenteeBookedApts = function(userID){
    	// 	mainService.getMyMenteeBookedApts(userID).then(function(results){
      //     for (var i = 0; i < results.length; i++) {
  		// 			results[i].type = "info";
    	// 		};
    	// 		$scope.eventsData = results;
      //     console.log('passing eventsdata');
    	// 	});
    	// };
      //
      // $scope.getCalendarData = function() {
      //   $scope.getMyMenteeBookedApts($scope.user._id);
      //   console.log("I ran");
      // };

      // $scope.notLoaded = false;
      // $scope.calendarLoaded = true;

      $scope.calendarView = 'month';
      $scope.viewDate = new Date();

      //calendar edit and delete icons
      // $scope.enableEdit = '<i class=\'glyphicon glyphicon-pencil\'></i>';
      $scope.enableDel = '<i class=\'glyphicon glyphicon-remove\'></i>';

      // $scope.events = [
      // {
      //   title: 'My event title', // The title of the event
      //   type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
      //   startsAt: new Date(2013,5,1,1), // A javascript date object for when the event starts
      //   endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
      //   editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
      //   deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
      //   draggable: true, //Allow an event to be dragged and dropped
      //   resizable: true, //Allow an event to be resizable
      //   incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
      //   recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
      //   cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
      // }];

      // $scope.events = [
      //   {
      //     title: 'An event',
      //     type: 'warning',
      //     startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
      //     endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
      //     draggable: true,
      //     resizable: true
      //   },
      //   {
      //     title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
      //     type: 'info',
      //     startsAt: moment().subtract(1, 'day').toDate(),
      //     endsAt: moment().add(5, 'days').toDate(),
      //     draggable: true,
      //     resizable: true
      //   },
      //   {
      //     title: 'This is a really long event title that occurs on every year',
      //     type: 'important',
      //     startsAt: moment().startOf('day').add(7, 'hours').toDate(),
      //     endsAt: moment().startOf('day').add(19, 'hours').toDate(),
      //     recursOn: 'year',
      //     draggable: true,
      //     resizable: true
      //   }
      // ];

      $scope.isCellOpen = false;

      $scope.eventClicked = function(event) {
        swal({
          title: event.title,
          text: "The meeting is located at "+event.loc+".",
        });
      };

      $scope.eventEdited = function(event) {
        swal({
          title: 'Edited',
          text: event
        });
      };

      $scope.eventDeleted = function(event) {
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
            // console.log("event", event);
    				mainService.cancelApt(event._id).then(function(){
              $scope.updated($scope.$parent.$parent.user);
    					// $scope.getAllMyApts($scope.$parent.$parent.user);
    					$state.reload(true);
              // console.log('reload');
    				});
    			};
    		});
      };

      $scope.eventTimesChanged = function(event) {
        swal({
          title: 'Dropped or Resized',
          text: event
        });
      };

      $scope.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
      };

    }
  };
});
