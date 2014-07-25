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
    var browsers = [{
        browserName: 'firefox',
        platform: 'XP'
    }, {
        browserName: 'chrome',
        platform: 'XP'
    }, {
        browserName: 'chrome',
        platform: 'linux'
    }, {
        browserName: 'internet explorer',
        platform: 'WIN8.1',
        version: '11'
    }, {
        browserName: 'internet explorer',
        platform: 'WIN8',
        version: '10'
    }, {
        browserName: 'internet explorer',
        platform: 'VISTA',
        version: '9'
    }];

    var port = 9999;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            'default': {
                src: ['src/app/run.js'],
                options: {
                    specs: ['src/app/**/Spec*.js'],
                    vendor: [
                        'src/jasmine-jsreporter/jasmine-jsreporter.js',
                        'src/jasmine-favicon-reporter/vendor/favico.js',
                        'src/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js'
                    ],
                    host: 'http://127.0.0.1:' + port,
                    sauceConfig: {
                        'video-upload-on-pass': false
                    }
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
            server: {
                options: {
                    base: '',
                    port: port
                }
            }
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
        },
        'saucelabs-jasmine': {
            all: {
                options: {
                    urls: ['http://127.0.0.1:' + port + '/_SpecRunner.html'],
                    tunnelTimeout: 5,
                    /* jshint ignore:start */
                    build: process.env.TRAVIS_JOB_ID,
                    /* jshint ignore:end */
                    concurrency: 6,
                    browsers: browsers,
                    testname: 'fiber-verification',
                    tags: ['master']
                }
            }
        }
    });

    // Loading dependencies
    for (var key in grunt.file.readJSON('package.json').devDependencies) {
        if (key !== 'grunt' && key.indexOf('grunt') === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    // Default task.
    grunt.registerTask('default', [
        'jshint',
        'amdcheck',
        'newer:esri_slurp',
        'jasmine:default:build',
        'connect',
        'watch'
    ]);
    grunt.registerTask('sauce', [
        'connect',
        'saucelabs-jasmine'
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
        'jshint',
        'esri_slurp',
        'connect',
        'jasmine:default',
        'saucelabs-jasmine'
    ]);
};