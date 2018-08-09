var app = angular.module('myapp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'mainController'
         })
         .when('/reg', {
            templateUrl: 'views/reg.html',
            controller:'registrationController'
         })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller:'homeController'
            
        })
        .when('/post',{
            templateUrl: 'views/post.html',
            controller:'postController'
        })
        .when('/search',{
            templateUrl:'views/search.html',
            controller:'searchController',
            resolve : ['authService', function(authService) {
			
                return authService.checkStatus();
            }]
    
            // controller:'resultController'
        })
        .when('/applied',{
            templateUrl:'views/applied.html',
            controller:'appliedController'
        })
        .when('/saved',{
            templateUrl:'views/saved.html',
            controller:'savedController'
        })
        
        // .when('/postajobpage', {
        //     templateUrl: 'views/postajobpage.html',
            
        // })
        // .when('/searchjob', {
        //     templateUrl: 'views/searchjobspage.html',
            
        .otherwise('/', {
             templateUrl: 'views/login.html'

        })
});

app.controller('mainController',function($scope,$location,$http,$rootScope){
    
    $scope.submit=function(){
        console.log($scope.authform);
        $http.post('http://localhost:8000/login1',$scope.authform).then(function(resp){
            console.log(resp);    
        console.log(resp.data.data);
            if(resp.data.flag!=="success")
            {
                $rootScope.wrong="Invalid Login Details Try again!!";
               
            }
            else{
                $location.path('/home');
            }
            if(resp.data.data.activeUser == true)
            {
                $rootScope.headerName = resp.data.data.username;
                sessionStorage.user = resp.data.data.username;
                console.log($rootScope.headerName);
                console.log(resp.data.data.usertype);

                $rootScope.btn1 = resp.data.data.usertype;
                $rootScope.btn2 = resp.data.data.usertype
                
            }
            
        })

    }
    
$scope.signup=function(){
$location.path('/reg');
}



});

app.controller('registrationController',function($scope,$http,$location){

    $scope.reg = function(){
        //console.log($scope.newUser);
    $http.post('http://localhost:8000/reg1',$scope.newUser).then(function(resp){
        // console.log(resp.data);
    })
      $location.path('/');
    }
})

app.controller('homeController',function($scope,$location,$http,$rootScope){
    $scope.postjob =function(){
        $location.path('/post');
    }
    $scope.searchjob=function(){
        $location.path('/search')
    }
    $scope.app_status=function(){
        $location.path('/applied')
    }
    $scope.saved_status=function(){
        $location.path('/saved')
    }
    $scope.logout=function(){
        
        $scope.userlogout=sessionStorage.user;
        delete sessionStorage.user;
        
        
        // $http.post('http://localhost:8000/logout1',$scope.headerName).then(function(resp){
    // console.log($scope.headerName);    
        
        // delete sessionStorage.user;
        // })
        $location.path('/')
    }
})

app.controller('postController',function($scope,$http,$location){
    $scope.post = function(){
        console.log($scope.newPost);
       $http.post('http://localhost:8000/post1',$scope.newPost).then(function(resp){
        //console.log(resp);
    })
    $location.path('/home');
    }
})

app.controller('searchController',function($scope,$http,$location,$rootScope){
    $scope.search =function(){
        console.log($scope.userSearch);
        $http.post('http://localhost:8000/search1',$scope.userSearch).then(function(resp){
        console.log(resp.data.data);
       
        $rootScope.result = resp.data.data;
        //console.log(result);
    })

    $http
    .get(`http://localhost:8000/users/${sessionStorage.user}`)
    .then(function (res) {
        $scope.user = res.data;
    });

    }

    $scope.sjob=function(){
        url="http://localhost:8000/saved1/" +  sessionStorage.user;
        //event.stopPropagation();
        $scope.save_id=event.target.id;
        console.log($scope.save_id);
       
        $http.post(url,{jobid:$scope.save_id}).then(function(res){
            console.log(res.data);

        if(res.data){
            $scope.user = res.data;
        }


        })
    }


    $scope.apply=function(event){
        url = "http://localhost:8000/applied1/" + sessionStorage.user;
        $scope.app_id=event.target.id;
       
    //     console.log(res._id);
    //    console.log($scope.app_id);
        // if(button id = $scope.app_id)
        // {
        // $scope.applied ="Applied";
        // }
        $http.post(url,{jobid:$scope.app_id}).then(function(res){
            console.log(res.data);
        
            if(res.data){
                $scope.user = res.data;
            }
        })
       
    }

    $scope.reset=function(){
        $scope.userSearch = null;
    }
  
  $scope.status_res=function(){
    $location.path('/home');
  }  

})


app.controller('appliedController',function($scope,$location,$http)
{
 
    $scope.app_result=function()
    {
        
        $http.post(`http://localhost:8000/getAppliedJobs/${sessionStorage.user}`,$scope.userSearch).then(res=>{
            console.log(res.data);
            $scope.jobs=res.data
        })
    }


});

app.factory("authService",function ($location,$http,$q) {
	return {
		'checkStatus' :function() {
            var defer = $q.defer();
            
            setTimeout(function() {
                
            
                if (sessionStorage.user) {	
					defer.resolve();
				}
				else{
					$location.path('/login');
					defer.reject();
				}

              }, 1000);
           			
			return defer.promise;
	}

	};
});







app.controller('savedController',function($scope,$location,$http)
{
 
    $scope.app_result=function()
    {
        
        $http.post(`http://localhost:8000/getSavedJobs/${sessionStorage.user}`,$scope.userSearch).then(res=>{
            console.log(res.data);
            $scope.jobs=res.data
        })
    }


});
