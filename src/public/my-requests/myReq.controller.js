(function () {
"use strict";

angular.module('public')
.controller('MyRequestsController', MyRequestsController);

MyRequestsController.$inject = ['myRequests'];
function MyRequestsController(myRequests) {
  var $ctrl = this;
  $ctrl.myRequests = myRequests;
}

})();
