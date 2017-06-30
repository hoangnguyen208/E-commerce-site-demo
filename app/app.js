var myApp = angular.module("myApp", ["ngRoute","ngAnimate"]);

// Routing module to configure routes across views and controllers
myApp.config(["$routeProvider", function($routeProvider){
  $routeProvider
    .when("/home",{
      templateUrl: "views/home.html",
      controller: "homeCtrl"
    })
    .when("/cart",{
      templateUrl: "views/cart.html",
      controller: "cartCtrl"
    })
    .when("/contact",{
      templateUrl: "views/contact.html",
      controller: "contactCtrl"
    })
    .when("/contact-success", {
      templateUrl: "views/contact-success.html",
      controller: "contactCtrl"
    })
    .otherwise({
      redirectTo: "/home"
    });
}]);

// Use factory service to share storage of the same array of items
// for data-binding across controllers (home and cart)
myApp.factory("cartStorage", function(){
  var _cart = {
    items: []
  };
  var service = {
    get cart(){
      return _cart;
    }
  }
  return service;
})

// Home controller
myApp.controller("homeCtrl", ["$scope","$http", "cartStorage", function($scope, $http, cartStorage){
  // create a store of items
  $scope.cartStorage = cartStorage.cart;
  // get data
  $http.get("data/items.json").then(function(response){
    $scope.items = response.data;
  });
  // add quantity of items
  $scope.increaseItem = function(item){
    item.quantity++;
    item.showAddToCart = true;
  }
  // subtract quantity of items
  $scope.decreaseItem = function(item){
    item.quantity--;
    if(item.quantity <= 0){
      item.quantity = 0;
      item.addedToCart = false;
      item.showAddToCart = false;
      var removeItem = $scope.cartStorage.items.indexOf(item);
      if(removeItem > -1){
        $scope.cartStorage.items.splice(removeItem,1);
      }
    }
    else{
      item.showAddToCart = true;
    }
  }
  // add items to cart
  $scope.addToCart = function(item){
    $scope.cartStorage.items.push(item);
    item.addedToCart = true;
  }
  // Check how many items added to cart
  $scope.numberOfItem = function(item){
    return $scope.cartStorage.items.length;
  }
}]);

// Cart controller
myApp.controller("cartCtrl", ["$scope","cartStorage", function($scope, cartStorage){
  // create a store of items
  $scope.cartStorage = cartStorage.cart;
  // add quantity of items
  $scope.increaseItem = function(item){
    item.quantity++;
  }
  // subtract quantity of items
  $scope.decreaseItem = function(item){
    item.quantity--;
    if(item.quantity <= 0){
      item.quantity = 0;
      item.addedToCart = false;
      item.showAddToCart = false;
      var removeItem = $scope.cartStorage.items.indexOf(item);
      if(removeItem > -1){
        $scope.cartStorage.items.splice(removeItem,1);
      }
    }
  }
  // remove items from cart
  $scope.removeFromCart = function(item){
    item.quantity = 0;
    item.addedToCart = false;
    item.showAddToCart = false;
    var removeItem = $scope.cartStorage.items.indexOf(item);
    if(removeItem > -1){
      $scope.cartStorage.items.splice(removeItem,1);
    }
  }
  // calculate total cost of items
  $scope.total = function(){
    var total = 0;
    angular.forEach($scope.cartStorage.items, function(item){
      total += item.quantity * item.price;
    })
    return total;
  }
  // remove all items
  $scope.removeAll = function(){
    $scope.cartStorage.items = [];
  }
}]);

// Contact controller
myApp.controller("contactCtrl", ["$scope","$location", function($scope,$location){
  $scope.sendMessage = function(){
    $location.path("contact-success");
  };
}]);
