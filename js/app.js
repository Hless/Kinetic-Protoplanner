(function(){

    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };
  
    var app = angular.module('kinetic-protologger', ['chart.js']);
    
    app.service('Tags', function(){
        return [
            {"Tagname": "Kies een tag...", "ID": 0},
            {"Tagname":"Winkelgebied","Color":"#22AFFE","ID":1},
            {"Tagname":"Stad","Color":"#22AFFE","ID":2},
            {"Tagname":"Stadshart","Color":"#22AFFE","ID":3},
            {"Tagname":"Park","Color":"#22AFFE","ID":4},
            {"Tagname":"Kruidvat","Color":"#FFA500","ID":5},
            {"Tagname":"Hema","Color":"#FFA500","ID":6},
            {"Tagname":"Abri","Color":"#cff558","ID":7},
            {"Tagname":"Mupi","Color":"#cff558","ID":8}
        ];
    });
    app.controller('SelectorCtrl', function($scope, $http, Tags, $filter){
        $scope.dataRows = [];
        $scope.filter = {};
        $scope.selectedTag = Tags[0];
        $scope.activeTags = [];
        $scope.availableTags = $scope.allTags = Tags;
        $scope.activeNames = [];
        $scope.currentSelection = [];
        $scope.selectedRow = {};
        $scope.chartOptions = {
          labels: _.times(24, function(i){  return pad(i, 2) + ":00" }),
          series: ["Bereik"]
        };
      

        
        $http
        .get("/data/db.json")
        .then(function(data){
            $scope.dataRows = data.data; 
        }, function(){
            
        });
        
        $scope.addTag = function(){
            
            $scope.activeTags.push($scope.selectedTag);
          
            $scope.selectedTag = Tags[0];
        };
        
        $scope.removeTag = function(tag){
            $scope.activeTags = _.reject($scope.activeTags, {"ID": tag.ID});
        };
        
        $scope.$watch('[activeTags, dataRows]', function(){
            $scope.availableTags = _.differenceBy($scope.allTags, $scope.activeTags, 'ID');
            $scope.activeNames = _.map($scope.activeTags, "Tagname");
            $scope.currentSelection = $filter('filter')($scope.dataRows, $scope.filterActiveTags);
            $scope.currentSum = _.sumBy($scope.currentSelection, 'Reach');
            $scope.selectedRow = null;
          
            $scope.totals = _.times(24, function(){ return 0 ;});
            _.each($scope.currentSelection, function(row) {
              $scope.totals = _.map($scope.totals, function(x, i) {
                
                return x + row.Hours[i];
              });
            });
           
            
        }, true);
      
        $scope.openRow = function(row) {
          $scope.selectedRow = row;
        };
        
        $scope.filterActiveTags = function(row) {        
            return _.intersection(row.Tags, $scope.activeNames).length == $scope.activeNames.length;
        };
        
    });
    
}());