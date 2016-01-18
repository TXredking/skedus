angular.module("skedApp", ["ui.router"]).config(function($stateProvider, $urlRouterProvider, $httpProvider){

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

//AUTH STATES ////////////////////////////////////////////////////////////////
		.state('auth', {
			url: "",
			templateUrl: "templates/main.html",
			controller: "mainCtrl",
			resolve: {
				user: function(authService) {
					return authService.getAuthedUser();
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
		})



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
