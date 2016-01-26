angular.module("skedApp", ["ui.router", 'mwl.calendar', 'ui.bootstrap', 'ngAnimate', 'angular-spinkit']).config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){

	$urlRouterProvider.otherwise("/login");

	$stateProvider

// AUTHORIZATION ////////////////////////////////////////////////////////////////

		.state('login', {
				url: '/login',
				templateUrl: 'templates/login.html',
				controller: 'authCtrl'
			})
		.state('signup', {
			url: '/signup',
			templateUrl: 'templates/signup.html',
			controller: 'authCtrl'
		})
		.state('forgot', {
			url: '/forgot',
			templateUrl: 'templates/forgot.html',
			controller: 'authCtrl'
		})
		.state('reset', {
			url: '/reset/:token',
			templateUrl: 'templates/reset.html',
			controller: 'authCtrl'
		})

//AUTH STATES ////////////////////////////////////////////////////////////////
		.state('auth', {
			url: "",
			templateUrl: "templates/main.html",
			controller: "mainCtrl",
			resolve: {
				user: function(authService) {
					return authService.getAuthedUser();
				},
				apptRef: function(mainService, user) {
					return mainService.getMyMenteeBookedApts(user._id);
				},
				allMyAptRef: function(mainService, user) {
					return mainService.getMyBookedApts(user._id);
				}
			}
		})
		.state("auth.myHome", {
			url: "/home",
			controller: "myHomeCtrl",
			templateUrl: "templates/myHome.html"
		})
		.state("auth.createOrg", {
			url: "/create",
			controller: "createOrgCtrl",
			templateUrl: "templates/createOrg.html"
		})
		.state("auth.joinOrg", {
			url: "/join",
			controller: "joinOrgCtrl",
			templateUrl: "templates/joinOrg.html"
		})
		.state("auth.userProfile", {
			url: "/profile",
			controller: "profileCtrl",
			templateUrl: "templates/profile.html",
		})
		.state("auth.skedAptOrg", {
			url: "/skedApt/:id",
			controller: "skedAptOrgCtrl",
			templateUrl: "templates/skedAptOrg.html",
			resolve: {
				orgApptRef: function(skedAptService, $stateParams) {
					return skedAptService.getOrgOpenApts($stateParams.id);
				}
			}
		})
		.state("auth.org", {
			url: "/org/:id",
			controller: "orgCtrl",
			templateUrl: "templates/org.html"
		})
		.state("auth.orgManagement", {
			url: "/org/management/:id",
			controller: "orgManagementCtrl",
			templateUrl: "templates/orgManagement.html"
		})
		.state("auth.aptAvailability", {
			url: "/aptAvailability/:id",
			controller: "aptAvailabilityCtrl",
			templateUrl: "templates/aptAvailability.html"
		})

		.state("auth.userManage", {
			url: "/manage",
			controller: "manageCtrl",
			templateUrl: "templates/manage.html",
		});

	// $locationProvider.html5Mode(true);

	$httpProvider.interceptors.push(function($q, $injector, $location) {
    return {
      // This is the responseError interceptor
      responseError: function(rejection) {
        if (rejection.status === 401) {
          console.log("BAD DOG", rejection);
          document.location = "/#/login";
        }


        /* If not a 401, do nothing with this error.
         * This is necessary to make a `responseError`
         * interceptor a no-op. */
        return $q.reject(rejection);
      }
    };
	});


});
