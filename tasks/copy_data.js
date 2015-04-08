module.exports = function (grunt) { 
    grunt.registerTask('copy_application_data', function () {
        var data = grunt.file.read('source/data/processed/data.json'),
            contents = 
            'define(function () {'  +
                'return ' + data + ';' +
            ' });';

        grunt.file.write('source/js/data/data.js', contents);
    });

    grunt.registerTask('copy_test_data', function () {

        var contents = 'define(function () { var testData = {';

        grunt.file.recurse('source/data/processed/testdata', function (abspath, rootdir, subdir, filename) {
            var json = grunt.file.read(abspath),
                inputData = filename.replace('.json', '');

            contents += '"' + inputData + '": ' + json + ',';
        });
        
        contents += '}; return testData; });';

        grunt.file.write('source/js/spec/data/testData.js', contents);  
    });

    grunt.registerTask('copy_data', ['copy_application_data', 'copy_test_data']);
};