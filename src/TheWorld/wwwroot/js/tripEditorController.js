(function () {
    "use strict";

    angular.module("app-trips")
        .controller("tripEditorController", tripEditorController);

    function tripEditorController($routeParams, $http) {
        var vm = this;

        vm.tripName = $routeParams.tripName;
        vm.stops = [];
        vm.errorMessage = "";
        vm.isBusy = true;
        vm.newStop = {};
        var url = "/api/trips/" + vm.tripName + "/stops"

        $http.get(url)
        .then(function (reponse) {
            //success
            angular.copy(reponse.data, vm.stops);
            _showMap(vm.stops);
        }, function (err) {
            //failure
            vm.errorMessage = "Failed to load stops";
        })
        .finally(function () {
            vm.isBusy = false;
        });

        vm.addStop = function () {
            vm.isBusy = true;
            $http.post(url, vm.newStop)
            .then(function (response) {
                //success
                vm.stops.push(response.data)
                _showMap(vm.stops);
                vm.newStop = {};
            }, function (err) {
                //failure
                vm.errorMessage = "Failed to add new stop";
            })
            .finally(function () {
                vm.isBusy = false
            });
        };
    }

    function _showMap(stops) {
        // Coords collection array
        var stopsCoordinates = [];
        // Coords Object
        var uluru = {};

        // Loop thru stops
        for (var i = 0, len = stops.length; i < len; i++) {
            // Loop thru stops and make coords object
            uluru = { lat: stops[i].latitude, lng: stops[i].longitude }
            // center on first coords
            if (i == 0) {
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: uluru,
                    title: stops[i].name
                });
            };
            // add new marker for each coords
            var marker = new google.maps.Marker({
                position: uluru,
                map: map,
                title: stops[i].name
            });
            // put Coords in the array
            stopsCoordinates.push(uluru);
        }

        // Build lines between stops
        var travelPath = new google.maps.Polyline({
            path: stopsCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        // Draw lines to stops
        travelPath.setMap(map);
    }
})();