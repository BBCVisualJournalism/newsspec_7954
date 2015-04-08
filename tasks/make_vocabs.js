module.exports = function (grunt) {
    grunt.config('cloudfile_to_vocab', {
        questions: {
            options: {
                output_directory:      'source/vocabs/questions',
                google_spreadsheet_id: '<%= config.vocabs.questions.googleSpreadsheetId %>',
                worksheet:             '<%= config.vocabs.questions.worksheet %>',
                username:              '<%= env.google.username %>',
                password:              '<%= env.google.password %>'
            }
        },
        sports: {
            options: {
                output_directory:      'source/vocabs/sports',
                google_spreadsheet_id: '<%= config.vocabs.sports.googleSpreadsheetId %>',
                worksheet:             '<%= config.vocabs.sports.worksheet %>',
                username:              '<%= env.google.username %>',
                password:              '<%= env.google.password %>'
            }
        },
        scaffolding: {
            options: {
                output_directory:      'source/vocabs/scaffolding',
                google_spreadsheet_id: '<%= config.vocabs.scaffolding.googleSpreadsheetId %>',
                worksheet:             '<%= config.vocabs.scaffolding.worksheet %>',
                username:              '<%= env.google.username %>',
                password:              '<%= env.google.password %>'
            }
        }
    });

    grunt.config('merge-json', {
        'english': {
            src: ['source/vocabs/questions/english.json', 'source/vocabs/sports/english.json', 'source/vocabs/scaffolding/english.json'],
            dest: 'source/vocabs/english.json'
        },
        'welsh': {
            src: ['source/vocabs/questions/welsh.json', 'source/vocabs/sports/welsh.json', 'source/vocabs/scaffolding/welsh.json'],
            dest: 'source/vocabs/welsh.json'
        }
        // @TODO - can add more languages here. Could probably find a way of automating this, but
        // for what it's worth we may as well just list languages individually.
        /*,
        'de': {
            src: [ 'src/de.json' ],
            dest: 'www/de.json'
        }*/
    });

    grunt.loadNpmTasks('grunt-cloudfile-to-vocab');
    grunt.loadNpmTasks('grunt-merge-json');
    grunt.registerTask('make_vocabs', ['cloudfile_to_vocab:questions', 'cloudfile_to_vocab:sports', 'cloudfile_to_vocab:scaffolding', 'merge-json']);
};