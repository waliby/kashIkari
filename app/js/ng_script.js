angular.module("pretox", [])
  .controller("gestionPret", function($scope){
    $scope.input = `<input type="text"/>`;
    $scope.test2 = $($scope.listPret);
    $scope.changeVal=function(item){
      $scope.newVal= item;
    }
  })

.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    if(total > 10)
      total = 10;
    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});
