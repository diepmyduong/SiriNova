app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    // scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    scope.fileread = changeEvent.target.files;
                    
                });
            });
        }
    }
}]);

app.directive("progressValue", [function () {
    return {
        scope: {
            value: "@"
        },
        link: function (scope, element, attributes) {
            scope.$watch(function(){
                progress(attributes.progressValue, element);
            });
        }
    }
}]);

app.directive("scrollableNice", [function () {
    return {
        link: function (scope, element, attributes) {
            element.niceScroll({
              horizrailenabled: false,
              cursorborder: "0",
              cursorwidth: "6px",
              cursorcolor: "#363636",
              zindex: "5555",
              autohidemode: true,
              bouncescroll: true,
              mousescrollstep: '40',
              scrollspeed: '100',
              background: "#cdcdcd",
              cursoropacitymax: "0.6",
              cursorborderradius: "0"
            });

            // element.getNiceScroll().resize();
        }
    }
}]);

// fit nested parent height
app.directive("dockParent", [function () {
    return {
        scope: {
            data: "@"
        },
        link: function (scope, element, attributes) {
            data = $.parseJSON(attributes.dockParent);
            var parentTag = data[0];
            var opPadding = data[1]?data[1]:0;
            var parent = element.parents(parentTag+':first');
            if(parent != null){
                var padding = parseInt(parent.css('padding-top').replace("px", "")) 
                            + parseInt(parent.css('padding-bottom').replace("px", ""));
                element.css('height',(parent.height() - padding - opPadding)+'px');
                if(element.hasClass('scrollable-content')){
                    var height = (parent.height() - padding - opPadding);
                    if(height >= 500){
                        element.addClass('siri-scrollable-lg');
                    }else if(height >= 380){
                        element.addClass('siri-scrollable-md');
                    }else{
                        element.addClass('siri-scrollable-sm');
                    }
                }
            }
        }
    }
}]);

//Siri Image Source
app.directive("srSrc", [function () {  
    return {
        scope: {
            data: "@"
        },
        link: function (scope, element, attributes) {
            var path = attributes.srSrc;
          if(path.startsWith("gs://")){
            var storageRef = firebase.storage().refFromURL(path);
            storageRef.getMetadata().then(function(metadata) {
              element.attr('src',metadata.downloadURLs[0]);
            }).catch(function(error) {
              element.attr('src','');
            });
          }else{
            element.attr('src',path);
          }
        }
    }
}]);

// angular.module('plunker')
//   .directive('commonThings', function ($compile) {
//     return {
//       restrict: 'A',
//       replace: false,
//       terminal: true,
//       priority: 1000,
//       compile: function compile(element, attrs) {
//         element.attr('tooltip', '{{dt()}}');
//         element.attr('tooltip-placement', 'bottom');
//         element.removeAttr("common-things");
//         return {
//           pre: function preLink(scope, iElement, iAttrs, controller) {  },
//           post: function postLink(scope, iElement, iAttrs, controller) {  
//             $compile(iElement)(scope);
//           }
//         };
//       }
//     };
//   });