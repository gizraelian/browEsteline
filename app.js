
var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "views/home.html",
        controller: "HomeController"
    })
    .when("/service-tattoo-removal", {
        templateUrl: "views/service-tattoo-removal.html",
        controller: "ServicesCtrl"
    })
    .when("/service-pmu", {
        templateUrl: "views/service-pmu.html",
        controller: "ServicesCtrl"
    })
    .when("/service-hair-removal-men", {
        templateUrl: "views/service-hair-removal-men.html",
        controller: "ServicesCtrl"
    })
    .when("/service-hair-removal-women", {
        templateUrl: "views/service-hair-removal-women.html",
        controller: "ServicesCtrl"
    })
    .when("/contact", {
        templateUrl: "views/contact.html",
        controller: "ContactCtrl"
    })

    .otherwise({
        redirectTo: '/'
    });
}]);


app.controller('NavbarController', ['$scope', function($scope, $timeout) {

    $scope.dropdownVisible = false;
    $scope.mobileMenuVisible = false;

    $scope.toggleDropdown = function() {
        $scope.dropdownVisible = !$scope.dropdownVisible;
        // console.log('dropdownVisible='+$scope.dropdownVisible);

        // $timeout(function () {
        //     // 
        //   }, 3000);

    };

    $scope.toggleMobileMenu = function() {
        $scope.mobileMenuVisible = !$scope.mobileMenuVisible;
    };

    $scope.navlinkClicked = function() {
        $scope.dropdownVisible = false;
        $scope.mobileMenuVisible = false;
    }

}]);

app.controller('HomeController', ['$scope', function($scope) {
    

    $scope.hairRemovalMenuVisible = false;
    $scope.dropdownVisible = false;
    $scope.mobileMenuVisible = false;
    
    $scope.showHairRemovalMenu = function () {
        $scope.hairRemovalMenuVisible = !$scope.hairRemovalMenuVisible;

        // console.log('hairRemovalMenuVisible = '+$scope.hairRemovalMenuVisible);
    }

}]);

app.controller('ServicesCtrl', ['$scope', function($scope) {
    
    $scope.dropdownVisible = false;
    $scope.mobileMenuVisible = false;

}]);

app.controller('ContactCtrl', ['$scope', function($scope) {

    $scope.dropdownVisible = false;
    $scope.mobileMenuVisible = false;

}]);