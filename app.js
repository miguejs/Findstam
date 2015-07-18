var app = angular.module('app', []);
//    var endPoint = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=73251e7e200b4352b8029ee9a1d3299c&callback=JSON_CALLBACK";
app.controller('mainController', function ($scope, $http) {
    //--------
    $scope.options = ["Tag", "Popular"];
   
    $scope.bar =true;
    
    if(window.outerWidth>=1920)
        $scope.quantitys = ["10", "20", "30"];
    else if(window.outerWidth<1920 & window.outerWidth>=1600 )
        $scope.quantitys = ["8", "16", "24"];  
     else if(window.outerWidth<1600 & window.outerWidth>=1280 )
       $scope.quantitys = ["6", "12", "18"];  
    else
       $scope.quantitys = ["4", "8", "12"];   
    
    $scope.count  = $scope.quantitys[0];
    $scope.select = $scope.options[0];    
    
    
    
    $scope.button = true;
    //---------
    var URL = "https://api.instagram.com/v1/";
    var id = "client_id=73251e7e200b4352b8029ee9a1d3299c";
    var callback = "&callback=JSON_CALLBACK";
    clear();
    
    $scope.getimages = function () {
         $scope.button = false;
        switch($scope.select) {
           
            case $scope.options[0]:
                    $scope.bar =  true;
                    getImagesbyTag();
                    break;
                
            case  $scope.options[1]:
                    $scope.bar =  false;
                    getImagesbyPopular();
                    break;
        }
    }
    
    $scope.getMore = function () {
       
        switch($scope.select) {
           
            case $scope.options[0]:
                    $scope.getMoreTag();
                    break;
                           
            case  $scope.options[1]:
                    $scope.getMorePopular();
                    break;
        }
    }
    
    
   function clear(){
         $scope.pics = [];
         $scope.have = [];
         $scope.next ="";
   }
    //1920x1080 -> 10
    //1600x900 ->8
    //1280x800, 1440x900 ->6
   // 320x568
   //----------------------------------//
    
   function getImagesbyTag () {    
        clear();
        var tag = "tags/" + $scope.input + "/media/recent?";
        $scope.pCount ="&count="+ $scope.count;
        var tag_url = URL + tag + id + $scope.pCount + callback;
        
        $http.jsonp(tag_url).success(function (data) {
            $scope.next = "&max_id=" + data.pagination.next_max_id;            
            for (var i = 0; i < data.data.length; i++) { 
              if(typeof $scope.have[data.data[i].id] ==="undefined"){
                  $scope.pics.push(data.data[i]);
                  $scope.have[data.data[i].id] = "1";
                }
            }
           
        }); 
       
        $scope.getMoreTag = function () {    
            var nextURL= URL +  tag + id + $scope.next + $scope.pCount + callback;
            
            $http.jsonp(nextURL).success(function (data) {
                $scope.next = "&max_id="+ data.pagination.next_max_id;
            
                for (var i = 0; i < data.data.length; i++) { 
                    if(typeof $scope.have[data.data[i].id] ==="undefined"){
                        $scope.pics.push(data.data[i]);
                        $scope.have[data.data[i].id] = "1";
                    }   
                }
            });   
        }   
        
    }  
   //----------------------------------//
   function  getImagesbyPopular() {    
        clear();
        var popular = "media/popular?";
        $scope.Pcount ="&count=" + $scope.count;
        var tag_url = URL + popular + id + $scope.Pcount + callback;
        
        $http.jsonp(tag_url).success(function (data) {
            for (var i = 0; i < data.data.length; i++) { 
              if(typeof $scope.have[data.data[i].id] ==="undefined"){
                  $scope.pics.push(data.data[i]);
                  $scope.have[data.data[i].id] = "1";
                }
            }
        }); 
       
        $scope.getMorePopular = function () {    
            var nextURL= URL +  popular + id + $scope.next + $scope.Pcount + callback;
            $http.jsonp(nextURL).success(function (data) {
                for (var i = 0; i < data.data.length; i++) { 
                    if(typeof $scope.have[data.data[i].id] ==="undefined"){
                        $scope.pics.push(data.data[i]);
                        $scope.have[data.data[i].id] = "1";
                    }   
                }
            });   
        }   
    }  
});