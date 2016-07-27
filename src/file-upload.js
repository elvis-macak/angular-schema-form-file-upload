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
                ngModelCtrl[0].$setViewValue(null);
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
