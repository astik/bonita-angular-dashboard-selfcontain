'use strict';

var middlewareWithProxies = function (connect, options, appConfig) {
	var middlewares = [];
	// proxy management
	var proxyUrl, proxyOptions;
	var proxies = options.proxies;
	var proxy = require('proxy-middleware');
	var url = require('url');
	for (proxyUrl in proxies) {
		proxyOptions = url.parse(proxies[proxyUrl]);
		proxyOptions.route = proxyUrl;
		middlewares.push(proxy(proxyOptions));
	}
	// default conf
	middlewares.push(connect.static(appConfig.tmp));
	middlewares.push(connect().use('/bower_components', connect.static('./bower_components')));
	middlewares.push(connect.static(appConfig.app));
	return middlewares;
};

var proxies = {
	'/bonita' : 'http://bisounours.dhcp.nantes.intranet:8080/bonita'
};

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var appConfig = {
		app : require('./bower.json').appPath || 'app',
		dist : 'dist',
		tmp : '.tmp',
		test : 'test'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman : appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch : {
			bower : {
				files : [ 'bower.json' ],
				tasks : [ 'wiredep' ]
			},
			js : {
				files : [ '<%= yeoman.app %>/scripts/{,*/}*.js' ],
				tasks : [ 'newer:jshint:all' ],
				options : {
					livereload : '<%= connect.options.livereload %>'
				}
			},
			jsTest : {
				files : [ '<%= yeoman.test %>/spec/{,*/}*.js' ],
				tasks : [ 'newer:jshint:test', 'karma' ]
			},
			styles : {
				files : [ '<%= yeoman.app %>/styles/{,*/}*.css' ],
				tasks : [ 'newer:copy:styles', 'autoprefixer' ]
			},
			gruntfile : {
				files : [ 'Gruntfile.js' ]
			},
			livereload : {
				options : {
					livereload : '<%= connect.options.livereload %>'
				},
				files : [ '<%= yeoman.app %>/{,*/}*.html', '<%= yeoman.tmp %>/styles/{,*/}*.css', '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}' ]
			}
		},

		// The actual grunt server settings
		connect : {
			options : {
				port : 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname : '0.0.0.0',
				livereload : 35729
			},
			livereload : {
				options : {
					open : true,
					proxies : proxies,
					middleware : function (connect, options) {
						return middlewareWithProxies(connect, options, appConfig);
					}
				}
			},
			test : {
				options : {
					port : 9001,
					middleware : function (connect) {
						return [ connect.static(appConfig.test), connect.static('test'), connect().use('/bower_components', connect.static('./bower_components')), connect.static(appConfig.app) ];
					}
				}
			},
			dist : {
				options : {
					open : true,
					base : '<%= yeoman.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require('jshint-stylish')
			},
			all : {
				src : [ 'Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js' ]
			},
			test : {
				options : {
					jshintrc : '<%= yeoman.test %>/.jshintrc'
				},
				src : [ '<%= yeoman.test %>/spec/{,*/}*.js' ]
			}
		},

		// Empties folders to start fresh
		clean : {
			dist : {
				files : [ {
					dot : true,
					src : [ '<%= yeoman.tmp %>', '<%= yeoman.dist %>/{,*/}*', '!<%= yeoman.dist %>/.git*' ]
				} ]
			},
			server : '<%= yeoman.tmp %>'
		},

		// Add vendor prefixed styles
		autoprefixer : {
			options : {
				browsers : [ 'last 1 version' ]
			},
			dist : {
				files : [ {
					expand : true,
					cwd : '<%= yeoman.tmp %>/styles/',
					src : '{,*/}*.css',
					dest : '<%= yeoman.tmp %>/styles/'
				} ]
			}
		},

		// Automatically inject Bower components into the app
		wiredep : {
			app : {
				src : [ '<%= yeoman.app %>/index.html' ],
				ignorePath : /\.\.\//
			}
		},

		// Renames files for browser caching purposes
		filerev : {
			dist : {
				src : [ '<%= yeoman.dist %>/scripts/{,*/}*.js', '<%= yeoman.dist %>/styles/{,*/}*.css', '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'<%= yeoman.dist %>/styles/fonts/*' ]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that
		// automatically
		// concat, minify and revision files. Creates configurations in memory
		// so
		// additional tasks can operate on them
		useminPrepare : {
			html : '<%= yeoman.app %>/index.html',
			options : {
				dest : '<%= yeoman.dist %>',
				flow : {
					html : {
						steps : {
							js : [ 'concat', 'uglifyjs' ],
							css : [ 'cssmin' ]
						},
						post : {}
					}
				}
			}
		},

		// Performs rewrites based on filerev and the useminPrepare
		// configuration
		usemin : {
			html : [ '<%= yeoman.dist %>/{,*/}*.html' ],
			css : [ '<%= yeoman.dist %>/styles/{,*/}*.css' ],
			options : {
				assetsDirs : [ '<%= yeoman.dist %>', '<%= yeoman.dist %>/images' ]
			}
		},

		imagemin : {
			dist : {
				files : [ {
					expand : true,
					cwd : '<%= yeoman.app %>/images',
					src : '{,*/}*.{png,jpg,jpeg,gif}',
					dest : '<%= yeoman.dist %>/images'
				} ]
			}
		},

		svgmin : {
			dist : {
				files : [ {
					expand : true,
					cwd : '<%= yeoman.app %>/images',
					src : '{,*/}*.svg',
					dest : '<%= yeoman.dist %>/images'
				} ]
			}
		},

		htmlmin : {
			dist : {
				options : {
					collapseWhitespace : true,
					conservativeCollapse : true,
					collapseBooleanAttributes : true,
					removeCommentsFromCDATA : true,
					removeOptionalTags : true
				},
				files : [ {
					expand : true,
					cwd : '<%= yeoman.dist %>',
					src : [ '*.html', 'views/{,*/}*.html' ],
					dest : '<%= yeoman.dist %>'
				} ]
			}
		},

		// ng-annotate tries to make the code safe for minification
		// automatically
		// by using the Angular long form for dependency injection.
		ngAnnotate : {
			dist : {
				files : [ {
					expand : true,
					cwd : '<%= yeoman.tmp %>/concat/scripts',
					src : [ '*.js', '!oldieshim.js' ],
					dest : '<%= yeoman.tmp %>/concat/scripts'
				} ]
			}
		},

		// Replace Google CDN references
		cdnify : {
			dist : {
				html : [ '<%= yeoman.dist %>/*.html' ]
			}
		},

		// Copies remaining files to places other tasks can use
		copy : {
			dist : {
				files : [ {
					expand : true,
					dot : true,
					cwd : '<%= yeoman.app %>',
					dest : '<%= yeoman.dist %>',
					src : [ '*.{ico,png,txt}', '.htaccess', '*.html', 'views/{,*/}*.html', 'images/{,*/}*.{webp}', 'fonts/*' ]
				}, {
					expand : true,
					cwd : '<%= yeoman.tmp %>/images',
					dest : '<%= yeoman.dist %>/images',
					src : [ 'generated/*' ]
				}, {
					expand : true,
					cwd : 'bower_components/bootstrap/dist',
					src : 'fonts/*',
					dest : '<%= yeoman.dist %>'
				} ]
			},
			styles : {
				expand : true,
				cwd : '<%= yeoman.app %>/styles',
				dest : '<%= yeoman.tmp %>/styles/',
				src : '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent : {
			server : [ 'copy:styles' ],
			test : [ 'copy:styles' ],
			dist : [ 'copy:styles', 'imagemin', 'svgmin' ]
		},

		// Test settings
		karma : {
			unit : {
				configFile : 'test/karma.conf.js',
				singleRun : true
			}
		}
	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function (proxyTarget) {
		// if (target === 'dist') {
		// return grunt.task.run([ 'build', 'connect:dist:keepalive' ]);
		// }
		if (!proxyTarget) {
			grunt.fail.warn('proxyTarget should be set : grunt serve:"http\://PATH_TO_BONITA_SERVER\:PORT"');
			return;
		}
		proxies['/bonita'] = proxyTarget;
		grunt.task.run([ 'clean:server', 'wiredep', 'concurrent:server', 'autoprefixer', 'connect:livereload', 'watch' ]);
	});

	grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run([ 'serve:' + target ]);
	});

	grunt.registerTask('test', [ 'clean:server', 'concurrent:test', 'autoprefixer', 'connect:test', 'karma' ]);

	grunt.registerTask('build', [ 'clean:dist', 'wiredep', 'useminPrepare', 'concurrent:dist', 'autoprefixer', 'concat', 'ngAnnotate', 'copy:dist', 'cdnify', 'cssmin', 'uglify', 'filerev', 'usemin',
			'htmlmin' ]);

	grunt.registerTask('default', [ 'newer:jshint', 'test', 'build' ]);
};
