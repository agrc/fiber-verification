/* jshint camelcase:false */
module.exports = function(grunt) {
    var jsFiles = 'src/app/**/*.js';
    var otherFiles = [
        'src/app/**/*.html',
        'src/app/**/*.css',
        'src/index.html',
        'src/ChangeLog.html'
    ];
    var gruntFile = 'GruntFile.js';
    var internFile = 'tests/intern.js';
    var jshintFiles = [jsFiles, gruntFile, internFile];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            'default': {
                src: ['src/app/run.js'],
                options: {
                    specs: ['src/app/**/Spec*.js'],
                    vendor: [
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js'
                    ],
                    host: 'http://localhost:8000'
                }
            }
        },
        jshint: {
            files: jshintFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            jshint: {
                files: jshintFiles,
                tasks: ['jshint', 'jasmine:default:build']
            },
            src: {
                files: jshintFiles.concat(otherFiles),
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            uses_defaults: {}
        },
        dojo: {
            prod: {
                options: {
                    // You can also specify options to be used in all your tasks
                    profiles: ['profiles/prod.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            stage: {
                options: {
                    // You can also specify options to be used in all your tasks
                    profiles: ['profiles/stage.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            options: {
                // You can also specify options to be used in all your tasks
                dojo: 'src/dojo/dojo.js', // Path to dojo.js file in dojo source
                load: 'build', // Optional: Utility to bootstrap (Default: 'build')
                releaseDir: '../dist',
                require: 'src/app/run.js', // Optional: Module to require for the build (Default: nothing)
                basePath: './src'
            }
        },
        processhtml: {
            options: {},
            dist: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'src/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/' // Destination path prefix
                }]
            }
        },
        copy: {
            main: {
                src: 'src/ChangeLog.html',
                dest: 'dist/ChangeLog.html'
            }
        },
        esri_slurp: {
            options: {
                version: 3.9
            }
        },
        clean: ['dist'],
        compress: {
            main: {
                options: {
                    archive: 'deploy/fiberVerification.zip'
                },
                files: [{
                    src: ['dist/**'],
                    dest: '/'
                }]
            }
        },
        amdcheck: {
            dev: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [{
                    src: [
                        'src/app/**/*.js'
                    ]
                }]
            }
        }
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-dojo');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-esri-slurp');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-amdcheck');
    grunt.loadNpmTasks('grunt-newer');

    // Default task.
    grunt.registerTask('default', [
        'jshint',
        'amdcheck',
        'newer:esri_slurp',
        'jasmine:default:build',
        'connect',
        'watch'
    ]);
    grunt.registerTask('build', [
        'clean',
        'dojo:prod',
        'imagemin:dynamic',
        'copy',
        'processhtml:dist',
        'compress'
    ]);
    grunt.registerTask('stage-build', [
        'clean',
        'dojo:stage',
        'imagemin:dynamic',
        'copy',
        'processhtml:dist',
        'compress'
    ]);
    grunt.registerTask('travis', [
        'newer:esri_slurp',
        'jshint',
        'connect',
        'jasmine:default'
    ]);
};