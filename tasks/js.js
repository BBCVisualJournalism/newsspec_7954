module.exports = function (grunt) {

    grunt.registerTask('copy_js_minimum', ['copy:requirejs', 'copy:legacyie', 'copy:d3']);

    grunt.config(['copy', 'requirejs'], {
        files: [{
            expand: true,
            cwd:    'source/js/lib/vendors/require/',
            src:    ['*.js'],
            dest:   'content/<%= config.services.default %>/js/lib/vendors/require/'
        }]
    });

    grunt.config(['copy', 'legacyie'], {
        files: [{
            expand: true,
            cwd:    'source/js/lib/vendors/',
            src:    ['legacy-ie-polyfills.js'],
            dest:   'content/<%= config.services.default %>/js/lib/vendors/'
        }]
    });

    grunt.config(['copy', 'd3'], {
        files: [{
            expand: true,
            cwd:    'source/js/lib/vendors/d3/',
            src:    ['d3.v3.min.js'],
            dest:   'content/<%= config.services.default %>/js/lib/vendors/d3/'
        }]
    });

    grunt.config(['copy', 'jsAll'], {
        files: [{
            expand: true,
            cwd:    'source/js/',
            src:    ['**'],
            dest:   'content/<%= config.services.default %>/js/'
        }]
    });

    grunt.config(['clean', 'allJs'], {
        src: ['content/<%= config.services.default %>/js']
    });
    grunt.config('uglify', {
        options: {
            mangle: true
        },
        my_target: {
            files: {
                'content/<%= config.services.default %>/js/lib/news_special/iframemanager__host.js': ['source/js/lib/news_special/iframemanager__host.js']
            }
        }
    });

    grunt.registerTask('copyRequiredJs', function () {
        var config = grunt.file.readJSON('config.json');
        if (config.debug === 'true') {
            grunt.task.run('copy:jsAll');
            grunt.task.run('uglify');
        } else {
            grunt.task.run('copy_js_minimum');
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.config(['concurrent', 'js'], {
        tasks: ['jshint', /*'jasmine',*/ 'requirejs:build']
    });
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.registerTask('js', ['clean:allJs', 'overrideImagerImageSizes', 'concurrent:js', 'copyRequiredJs']);
    //grunt.registerTask('js', ['clean:allJs', 'overrideImagerImageSizes', 'jshint', 'sandboxed_jasmine', 'requirejs:jquery1', 'requirejs:jquery2', 'copyRequiredJs']);
};
