module.exports = function (grunt) {

    var optimize = 'uglify2'; // change to 'uglify2' for production

    // *************************************************************************
    // REQUIRE PATHS
    // Add any paths here you want shortened. Relative to the 'js' dir.
    // *************************************************************************

    var amdModulePaths = {
        'pubsub':      './lib/vendors/jquery/pubsub',
        'istats':      './lib/vendors/istats/istats',
        'd3':          './lib/vendors/d3/d3.v3.min',
        'bump-3':      './lib/vendors/bump-3/bump-3',
        // bump dependencies
        'swfobject-2': './lib/vendors/swf/swfobject-2',
        'jquery-1.9':  './lib/vendors/jquery/jquery-1.9.1-version_for_bump'
    };

    // *************************************************************************
    // GRUNT CONFIG
    // You shouldn't need to edit anything below here
    // *************************************************************************

    var _ = require('lodash-node');

    grunt.config(['amdModulePaths'], amdModulePaths);

    grunt.config(['requirejs', 'build'], {
        options: {
            baseUrl: './source/js',
            paths: amdModulePaths,
            optimize: optimize,
            generateSourceMaps: true,
            preserveLicenseComments: false,
            name: './app',
            out: './content/<%= config.services.default %>/js/all.js'
        }
    });
    grunt.loadNpmTasks('grunt-contrib-requirejs');
};