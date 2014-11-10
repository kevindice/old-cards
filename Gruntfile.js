module.exports = function(grunt){

// Load Grunt tasks declared in the package.json file
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

var path = require('path');
console.log(path.resolve('public'));

// Configure Grunt
grunt.initConfig({

// Compile Sass Stuff

sass:{
  options: {
    sourceMap: true
  },
  dist: {
    files: {
      'public/stylesheets/style.css': 'foundation/scss/app.scss'
    }
  }
},

// Grunt express - the webserver
// https://github.com/blai/grunt-express

//express: {
//  all: {
//    options: {
//      server: 'app.js',
//      port: 8080,
//      hostname: "0.0.0.0",
//      livereload: true,
//      debug: true,
//      bases: path.resolve('public')
//    }
//  }
//},

// grunt-watch will monitor the projects files
// https://github.com/gruntjs/grunt-contrib-watch

watch: {
  all: {
    files: ['**/*.jade', '**/*.js', '**/*.css', 'public/**/*.js', 'public/**/*.css'],
    options: {
      livereload: true
    }
  },
  scss: {
    files: ['foundation/scss/*'],
    tasks: 'compileSass'
  }
}


});

// Creates the 'server' task

grunt.registerTask('server', [
  'sass:dist',
//  'express',
  'watch'
  ]);

grunt.registerTask('compileSass', [
  'sass:dist'
  ]);

};
