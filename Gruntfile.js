module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      all: {
        src: 'src/index.js',
        dest: 'dist/localizify.js'
      },
      options: {
        browserifyOptions: {
          standalone: 'localizify'
        },
        transform: [['babelify', { presets: ['es2015'] }]]
      }
    },
    uglify: {
      build: {
        src: 'dist/localizify.js',
        dest: 'dist/localizify.min.js'
      }
    },
    release: {
      options: {
        commitMessage: 'Release <%= version %>',
        tagName: 'v<%= version %>',
        beforeBump: ['browser']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('browser', ['browserify', 'uglify']);
  grunt.registerTask('default', 'browser');
};
