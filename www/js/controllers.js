angular.module('watto.controllers', ['ui.bootstrap'])

.controller('AppCtrl', function($scope, $rootScope, $http, $location, $ionicSideMenuDelegate, $ionicActionSheet, $timeout) {



// MOVIE BACKDROP NAV
  $scope.actionSheetButtonFunc1 = function(t) {
      console.log(t);
  };
  $scope.actionSheetButtonFunc2 = function(t) {
      console.log(t);
  };
  $scope.toggleMovieBackdrop = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: 'Share'},
            { text: 'Move' }
          ],
          destructiveText: 'Dont show it again',
          titleText: 'Movie control',
          cancelText: 'Cancel',
          cancel: function() {
            hideSheet();
          },
          destructiveButtonClicked: function(index) {
            console.log('delete movie');
            return true;
          },
          buttonClicked: function(index) {
            switch(index) {
              case 0:
                $scope.actionSheetButtonFunc1(index+1);
              break;
              case 1:
                $scope.actionSheetButtonFunc2(index+1);
              break;
            }
            return true;
          }
        });
  };


  $rootScope.today = new Date().toJSON().slice(0,10);
  $rootScope.tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toJSON().slice(0,10);

  $rootScope.storageChanged = true;
  
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.editAvalilable = function() {
    $rootScope.editAvalilable = $rootScope.editAvalilable == true ? false : true;
  };
  
 // initial state of app
  $scope.topMenu = { 
    isLeftAction : false,
    isRightMenuHref : true,
    rightMenuHref : '#/app/setup', 
    rightMenuClass : 'button-icon ion-ios-gear-outline'
  };

  $scope.$on('$ionicView.beforeLeave', function(){
    $scope.topMenu = {};
  });

  $scope.$on('$ionicView.afterLeave', function(){
    switch($location.url()) {
      case '/app/home':
        $scope.topMenu.isRightMenuHref = true;
        $scope.topMenu.rightMenuHref = '#/app/setup'; 
        $scope.topMenu.rightMenuClass = 'button-icon ion-ios-gear-outline';
      break;   

      case '/app/filters-actors':
        $scope.topMenu.isRightMenu = true;
        $scope.topMenu.rightMenuLabel = 'Edit';
        $scope.topMenu.rightMenuAction = $scope.editAvalilable; 
      break;
      case '/app/getmovie':
        $scope.topMenu.isLeftMenu = true;
        $scope.topMenu.isRightMenu = true;
        $scope.topMenu.leftMenuClass = 'button-icon ion-navicon';
        $scope.topMenu.rightMenuClass = 'button-icon ion-ios-upload-outline';
        $scope.topMenu.leftMenuAction = $scope.toggleLeftSideMenu;
        $scope.topMenu.rightMenuAction = $scope.toggleMovieBackdrop;
      break;    
    } 
  });

})

.controller('SetupCtrl', function($scope, $rootScope, $stateParams, $ionicPopup) {
  $scope.title = 'Settings';

  var size=0; 
  for(var x in localStorage) 
    size += ((localStorage[x].length * 2)/1024/1024);

  $scope.lsd = size.toFixed(2);

  $scope.clearAllData = function() {
    $ionicPopup.confirm({
       title: 'Clear all local data',
       template: 'Are you really want to clear all local data?',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-outline button-energized'
         },
         {
           text: '<b>Delete</b>',
           type: 'button-outline button-assertive',
           onTap: function(e) {
              return true;
           }
         }
       ]
     }).
     then(function(res) {
       if(res) {
         $rootScope.storageChanged=true;
         localStorage.clear();
       }
     });
  };
})

.controller('HomeCtrl', function($scope, $stateParams, $http) {
  $scope.title = '<ins>W</ins>ATTO';
  $scope.hcover = true;
})

.controller('FiltersCtrl', function($scope, $http, $stateParams, $ionicPopup, $rootScope) {
  $scope.title = 'Filters';
  $scope.genres_title = 'genres';
  $scope.release_date_title = 'Release date';
  $scope.countries_title = 'Countries';
  $scope.actors_title = 'Actors';



// ------------------ RELEASE DATES 

  var fromDate, toDate;
  //$scope.release_to = new Date();
  //$scope.release_from = new Date(1900, 0, 1);

  var lfd = localStorage.getItem("filters.fromDate");
  var ltd = localStorage.getItem("filters.toDate");
  
  $scope.a = lfd == null ? new Date(1920,0,1) : new Date(lfd);
  $scope.b = ltd == null ? new Date() : new Date(ltd);
  $scope.to_min = lfd == null ? new Date(1920,0,1).toJSON().slice(0,10) : new Date(lfd).toJSON().slice(0,10);

  $scope.setFromDate = function(a){
    $rootScope.storageChanged=true;
    if(a=='' || !a) {
      $scope.wfd = true;
      localStorage.removeItem("filters.fromDate");
    } else {
      $scope.wfd = false;
      var ca = new Date(a).toString().substr(0,15)+" 12:00:00";
      fromDate = $scope.to_min = new Date(ca).toJSON().slice(0,10);
      localStorage.setItem("filters.fromDate", fromDate);
    }
  };

  $scope.setToDate = function(b){
    $rootScope.storageChanged=true;
    if(b=='' || !b) {
      $scope.wtd = true;
      localStorage.removeItem("filters.toDate");
    } else {
      $scope.wtd = false;
      var ca = new Date(b).toString().substr(0,15)+" 12:00:00";
      toDate = new Date(ca).toJSON().slice(0,10);
      localStorage.setItem("filters.toDate", toDate);
    } 
  };



// ------------------ LANGUAGES 
/*
// setup selected languages for the root.
  $scope.setupLanguages = function() { 
    $rootScope.storageChanged=true;
    $rootScope.sela = [];
    angular.forEach($scope.selected_language, function(i,k){
      angular.forEach($scope.languaes, function(l,m){
      if(i==true && k==l.id)
        $rootScope.sela.push(l.name);
      });
    });
  };
  $scope.resetLanguages = function(){
      $scope.selected_language = {};
      localStorage.removeItem("filters.selected_languages");
      $scope.setupLanguages();
  };
  $scope.selectLanguage = function(){
    if($scope.selected_language) {
      localStorage.setItem("filters.selected_languages", JSON.stringify($scope.selected_language));
      $scope.setupLanguages();
    } else {
      console.log('Error');
    }
  };

  var sl = JSON.parse(localStorage.getItem("filters.selected_languages"));
  $scope.selected_language = sl !=null ? sl : {};
// get languages
  $http.get('json/languages.json')
    .success(function(data){
      $scope.languages = data;
      console.log(data);
      $scope.setupLanguages();
    });

*/

// ------------------ GENRES 

// setup selected genres for the root.
  $scope.setupGenres = function() { 
    $rootScope.sege = [];
    angular.forEach($scope.selected_genre, function(i,k){
      angular.forEach($scope.genres, function(l,m){
      if(i==true && k==l.id)
        $rootScope.sege.push(l.name);
      });
    });
  };
  $scope.resetGenres = function(){
      $rootScope.storageChanged=true;
      $scope.selected_genre = {};
      localStorage.removeItem("filters.selected_genres");
      $scope.setupGenres();
  };
  $scope.selectGenre = function(){
    if($scope.selected_genre) {
      $rootScope.storageChanged=true;
      localStorage.setItem("filters.selected_genres", JSON.stringify($scope.selected_genre));
      $scope.setupGenres();
    } else {
      console.log('Error');
    }
  };

  var sg = JSON.parse(localStorage.getItem("filters.selected_genres"));
  $scope.selected_genre = sg !=null ? sg : {};
// get genres
  $http.get('http://api.themoviedb.org/3/genre/movie/list?api_key=d5dc997b35ea773ef7edc72bb47dca1e').success(function(data){
      $scope.genres = data.genres;
      $scope.setupGenres();
    });

  
 // ------------------ ALL FILTERS 

  $scope.clearAllFilters = function(){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Clear all filters',
       template: 'Are you really want to clear all filters?',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-outline button-energized'
         },
         {
           text: '<b>Delete</b>',
           type: 'button-outline button-assertive',
           onTap: function(e) {
              return true;
           }
         }
       ]
     });
     confirmPopup.then(function(res) {
       if(res) {
         $rootScope.storageChanged=true;
         $scope.setupGenres();
         localStorage.removeItem("filters.actors");
         // localStorage.removeItem("filters.selected_languages");
         localStorage.removeItem("filters.selected_genres");
         localStorage.removeItem("filters.fromDate");
         localStorage.removeItem("filters.toDate");
       }
     });
  };

})

// SCE need to be fixed and angular youtube js install

.controller('YouTubeVideoCtrl', function($scope,$stateParams) {
  $scope.video = 'http://www.youtube.com/embed/'+$stateParams.videoId+'?autoplay=1&cc_load_policy=1';
})

.controller('RatingCtrl', function($scope) {
  $scope.max = 5;
  $scope.isReadonly = true;

  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];
})

.controller('GetMovieCtrl', function($scope, $http, $stateParams, $timeout, $rootScope, $ionicLoading, $ionicScrollDelegate) {
  $scope.title = '<ins>W</ins>ATTO';


  $scope.hcover = true;
  $scope.showCover = function(){
    $scope.hcover = false;
  }

  $scope.render = function(num) {
    var validMovie = true;
    // jump top for details
    $ionicLoading.show({
        template: '<ion-spinner icon="ios-small" class="spinner-energized"></ion-spinner><br />Thinking...'
    });

// TODO caching here


    $http.get('http://api.themoviedb.org/3/movie/'+num+'?api_key=d5dc997b35ea773ef7edc72bb47dca1e').
      success(function(data){
        
    $scope.recentMoviesDetails.push(data);    
    localStorage.setItem("movies.recent_detailed", JSON.stringify($scope.recentMoviesDetails));
    // removed feature due its value
          
    /*  if($scope.localLanguages) {
          validMovie=false; 
          angular.forEach(data.spoken_languages, function(o){
            angular.forEach($scope.localLanguages, function(a,k){
              if(a == true && o.iso_639_1 == k) {
                validMovie=true; 
              }
            });
          });
          if(!validMovie)
            $scope.generate();
        }
    */
        if(data.adult == true || data.status.toLowerCase() != 'released') { 
          validMovie=false;
          $scope.generate();
        }

        if(validMovie) {
            console.log(data);
          $scope.movie = {
            title: data.title,
            genres: data.genres,
            overview: data.overview,
            countries: data.production_countries,
            otitle: data.original_title,
            votes: data.vote_count,
            poster: data.poster_path == null ? 'img/empty.png': 'https://image.tmdb.org/t/p/w396'+data.poster_path,  // original, 396, 185
            poster_tn: data.poster_path == null ? 'img/empty_tn.png' : 'https://image.tmdb.org/t/p/w185'+data.poster_path,  // original, 396, 185
            actors: []
          }

        // trailers
          $scope.showTrailer = false;
          $http.get('http://api.themoviedb.org/3/movie/'+num+'/videos?api_key=d5dc997b35ea773ef7edc72bb47dca1e').
            success(function(data){
              if(data.results[0]) {
                $scope.showTrailer = true;
                console.log(data.results[0].site)
                switch (data.results[0].site) {
                  case 'YouTube':
                    $rootScope.videoId = data.results[0].key;
                   break;
                }
              } 

              angular.forEach(data.crew,function(a){
                if(a.job == "Director")
                  $scope.movie.director = a.name;
              });
              angular.forEach(data.cast,function(a) {
                  $scope.movie.actors.push(a.name);
              });
            });

        // credits
          $http.get('http://api.themoviedb.org/3/movie/'+num+'/credits?api_key=d5dc997b35ea773ef7edc72bb47dca1e').
            success(function(data){
              angular.forEach(data.crew,function(a){
                if(a.job == "Director")
                  $scope.movie.director = a.name;
              });
              angular.forEach(data.cast,function(a) {
                  $scope.movie.actors.push(a.name);
              });
            });

          $rootScope.rate = parseInt(data.vote_average*10)/20;
          $scope.poster_bg = $scope.movie.poster;
        }
         
      }).
      error(function(data, status){
        console.log(data, status);  
        $scope.generate();
      });
  };    
    

  var recent = JSON.parse(localStorage.getItem("movies.recent"));
  var recent_detailed = JSON.parse(localStorage.getItem("movies.recent_detailed"));
  $scope.recentMovies = recent !=null ? recent : [];
  $scope.recentMoviesDetails = recent_detailed !=null ? recent_detailed : [];

  $scope.generate = function() {
    var ran = Math.floor((Math.random() * $rootScope.results.length) + 1);
        res = $rootScope.results[ran];
        
    $ionicScrollDelegate.$getByHandle('detailsContainer').scrollTop();
        // if no movies with this id can be wrong...
    $scope.recentMovies.push(res);    
    localStorage.setItem("movies.recent", JSON.stringify($scope.recentMovies));
    $scope.render(res);
  };

  $scope.showRes = function() {
      $scope.loading=false; 
      $ionicLoading.hide();    
  };

  $scope.gimmeNew = function () {
      $scope.loading=true;
      $scope.movie = {};
      $scope.generate();
  };

  $scope.prevResult = function () {
      console.log('a');
  };


  $scope.base = function() {

    if($rootScope.storageChanged) {
        $rootScope.storageChanged = false;
        $scope.loading=true;
        $scope.movie = {};

        $ionicLoading.show({
          template: '<ion-spinner icon="ios-small" class="spinner-energized"></ion-spinner><br />Loading...'
        });

        var localGenres = JSON.parse(localStorage.getItem("filters.selected_genres")),
            //localLanguages = JSON.parse(localStorage.getItem("filters.selected_languages")),
            fromDate = localStorage.getItem("filters.fromDate"),
            toDate = localStorage.getItem("filters.toDate"),
            popular = localStorage.getItem("filters.popular"), // not yet used and developed
            validMovie = true,
            qs,
            maxpages = 10, // max 150 pages 3000 movies;
            initialpages = 6;
        

        var qs = ''; // query string base

        if(localGenres != null) {
          qs += "&with_genres="; 
          var idx = 0;
          angular.forEach(localGenres, function(l,m){
            if(idx!=0 && l!=false)
              qs += "|"; // | or , and
            if(l!=false)
              qs += m;
            idx++;
          });
        }
      /*  
        if(localLanguages != null) {
          $scope.localLanguages = localLanguages;
        }
      */
        if(fromDate != null){
          qs += "&release_date.gte="+fromDate;
        } 
        if (toDate != null) {
          qs += "&release_date.lte="+toDate;
        }   


        if(qs == '' && popular == true)
          qs = 'http://api.themoviedb.org/3/movie/popular?api_key=d5dc997b35ea773ef7edc72bb47dca1e';
        else
          qs = 'http://api.themoviedb.org/3/discover/movie?api_key=d5dc997b35ea773ef7edc72bb47dca1e'+qs;

        var oqs = qs, i = 0;
        $rootScope.results = [];
        
        $scope.getData = function() {
            $http.get(qs).success(function(data){
                  if(i==0)
                    maxpages = data.total_pages <= maxpages ? data.total_pages : maxpages;

                  i++;
                  if(i<maxpages) {
                    angular.forEach(data.results,function(obj){
                      $rootScope.results.push(obj.id);
                    });
                    qs = oqs;
                    qs += "&page="+i;
                    $scope.getData(i); // keep requesting
                    if(i==initialpages)
                      $scope.generate();

                  } else if(i==maxpages) {
                    console.log('.calculation done: '+maxpages);
                  }
            }).
            error(function(data,status) {
              if(i<=initialpages) {
                $ionicLoading.show({
                  template: '<button ng-click="getData('+i+');" class="button button-icon ion-ios-refresh button-clear error"></button><br />Something went wrong.<br />Please try again.'
                });
              } else {
                console.log('something is wrong try again'+status);
              }
            });
        };
        $scope.getData();
    } else {
        var current = JSON.parse(localStorage.getItem("movies.recent"));
        $scope.render(current[current.length-1]);
    }
  }
  $scope.base();
});
