module.exports = function (grunt) {
    
    var defaults = {
            src: 'source/js/newsspec_<%= config.project_number %>/*.js',
            options: {
                keepRunner: true,
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: '<%= requirejs.jquery1.options.baseUrl %>',
                        paths: '<%= requirejs.jquery1.options.paths %>'
                    }
                }
            }
        };

    grunt.registerTask(
        'sandboxed_jasmine',
        'Runs Jasmine specs one at a time to prevent data leaking between tests',
        function () {

            var specs         = [],
                specDirectory = 'source/js/spec/',
                jasmineTestName;

            grunt.file.recurse(specDirectory, function (specFile, rootDir, subDir) {
                
                if (weAreNotInASubDirectory(subDir)) {
                    grunt.log.writeln('Defining test for ' + specFile);
                    jasmineTestName = createJasmineTask(specFile);
                    specs.push(jasmineTestName);
                }
            });

            runJasmineSpecs(specs);
    });

    function weAreNotInASubDirectory(subDir) {
        return subDir === undefined;
    }

    function createJasmineTask(specFile) {
        var jasmineTestName = 'individualTest_' + specFile.replace('.js', '');
        setDefaults(jasmineTestName);
        grunt.config.set('jasmine.' + jasmineTestName + '.options.specs', specFile);
        return jasmineTestName;
    }

    function setDefaults(jasmineTestName) {
        grunt.config.set('jasmine.' + jasmineTestName + '.src', defaults.src);
        grunt.config.set('jasmine.' + jasmineTestName + '.options.keepRunner', defaults.options.keepRunner);
        grunt.config.set('jasmine.' + jasmineTestName + '.options.template', defaults.options.template);
        grunt.config.set('jasmine.' + jasmineTestName + '.options.templateOptions.requireConfig.baseUrl', defaults.options.templateOptions.requireConfig.baseUrl);
        grunt.config.set('jasmine.' + jasmineTestName + '.options.templateOptions.requireConfig.paths', defaults.options.templateOptions.requireConfig.paths);
    }

    function runJasmineSpecs(specs) {
        for (var i = 0; i < specs.length; i++) {
            grunt.task.run('jasmine:' + specs[i]);
        }   
    }
};