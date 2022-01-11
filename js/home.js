/*!
 * Custom JS v1.0.0
 * Author: Tsvetan Paskov
 *
 * Modules
 * 1. initAngular method
 * 2. initServices method - Service using Ajax to grab data the from
 * 3. initTripSearch method - init TripSearch angularJS controller
 * 
 */
(function () {
    'use strict';

	var projectNS = {}; // this will be the Namespace for the Project - TODO rename it

	// constants
	projectNS.vars = {
		filterDefault: "Cheapest",
		filterOptions: ["Cheapest", "Fastest"],
		filterProperties: {
			"Cheapest": "cost",
			"Fastest": "durationSeconds"
		}
	};

	projectNS.methods = {
		initAngular: function () {
			projectNS.angularModule = angular.module('myApp', ['angular.filter']);
		},
		
		initServices: function () {
			projectNS.angularModule.factory("GetDataService",['$http', function($http) {
			  return {
				updateData :  function(type, callback) {	
					$http.get('data/response.json')
						 .success(callback)
						 .error(callback);
				}
			  }
			}]);
		},
		
		initTripSearch: function () {
			projectNS.angularModule.controller("TripSearchCtrl", ['$scope', 'GetDataService', function ($scope, GetDataService) {
				$scope.filterLbl = projectNS.vars.filterDefault;
				$scope.sortOptions = projectNS.vars.filterOptions;
				$scope.sort = projectNS.vars.filterProperties[projectNS.vars.filterDefault];
				
				$scope.setSort = function(type) { 
					$scope.filterLbl = type;
					$scope.sort = projectNS.vars.filterProperties[type]; 
				};
				$scope.isVisible = false;
				
				// Method who is responsible for getting data + showing errors if there is problem with API
				$scope.updateData =  function(type) {
					GetDataService.updateData(type, function(data){
						if (data.deals) {
							$scope.deals = data.deals; 
						}
						else {
							$scope.errorMsg = "Error with loading the data";
							$scope.isErrorVisible = true;
						}
					});
				}
				
				$scope.updateData(projectNS.vars.filterDefault); // set initial state - load data
				
				$scope.searchData = function() {
					$scope.isVisible = true;
					angular.forEach($scope.deals, function(deal, index) {
						deal.durationSeconds = deal.duration.h * 60 * 60 + deal.duration.m * 60;
						deal.cost = deal.cost - (deal.cost * (deal.discount/100));
					});
				}
				
				$scope.reset = function() {
					$scope.isVisible = false;
					$scope.fromLBL = "";
					$scope.toLBL = "";
				}
			}]);
		}
	};
		
	projectNS.methods.initAngular();
	projectNS.methods.initServices();
	projectNS.methods.initTripSearch();
})();