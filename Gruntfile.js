/*
 * Sumter
 * https://github.com/chriszarate/Sumter
 */

module.exports = function(grunt) {

  grunt.initConfig({

    meta: { name: 'Sumter' },

    jshint: {
      all: ['js/sumter.js']
    },

    uglify: {
      all: {
        files: {
          'build/sumter.js': ['js/sumter.js']
        }
      }
    },

    bookmarklet: {
      all: {
        files: {
          'build/sumter.bookmarklet.js': ['js/sumter.bookmarklet.js']
        }
      }
    }

  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerMultiTask('bookmarklet', 'Generate bookmarklet', function() {

    var bookmarkletify = require('bookmarkletify'),
        cacheBustFlag = new RegExp('\\?updated', 'g'),
        cacheBust = grunt.template.today('?yyyymmdd');

    this.files.forEach(function(file) {

      // From Grunt.js API documentation.
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read and return the file's source.
        return grunt.file.read(filepath);
      }).join('');

      // Provide cache-busting query string.
      contents = contents.replace(cacheBustFlag, cacheBust);

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, bookmarkletify(contents));
      grunt.log.writeln('Created bookmarklet: ' + file.dest);

    });

  });

  grunt.registerTask('default', ['jshint', 'uglify', 'bookmarklet']);

};
