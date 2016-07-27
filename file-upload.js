angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/fileUpload/file-upload.html","<div class=\"form-group\" ng-class=\"{\'has-error\': hasError()}\">\n    <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n    <div>\n        \n        <input ng-model=\"$$value$$\" \n               type=\"file\"\n               on-read-file/>\n        \n        <span ng-show=\"$$value$$\" class=\"bg-info\">File URL: {{ $$value$$ }}</span>\n        <span ng-show=\"!$$value$$\" class=\"bg-danger\">It has not yet uploaded a file</span>\n    </div>\n    <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");}]);
angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
            var fileUpload = function (name, schema, options) {
                if (schema.type === 'string' && schema.format === 'file') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'fileUpload';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(fileUpload);

            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'fileUpload',
                'directives/decorators/bootstrap/fileUpload/file-upload.html'
            );
            
            schemaFormDecoratorsProvider.createDirective(
                'fileUpload',
                'directives/decorators/bootstrap/fileUpload/file-upload.html'
            );
  }]);

angular.module('schemaForm').directive('onReadFile', ['$http', function ($http) {
    return {
        restrict: 'A',
        require: ['ngModel'],
        scope: false,
        link: function (scope, element, attrs, ngModelCtrl) {
            element.on('change', function (onChangeEvent) {
                var data = new FormData();
                var file = (onChangeEvent.srcElement || onChangeEvent.target).files[0];
                data.append('file', file);
                $http.post('/api/common/upload', data, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
                }).then(function(url){
                    ngModelCtrl[0].$setViewValue(url);
                });
            });
        }
    };
}]);
