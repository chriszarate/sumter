/*
 * Sumter
 * https://github.com/chriszarate/Sumter
 */

module.exports = function(grunt) {

  grunt.initConfig({

    meta: {
      name: 'Sumter',
      hostedURL: '//d391j46upa8a0p.cloudfront.net/js/sumter.js'
    },

    jshint: {
      all: ['js/sumter.js']
    },

    uglify: {
      all: {
        files: {
          'build/sumter.js': ['js/sumter.js'],
          'build/bookmarklet-hosted.js': ['js/sumter.bookmarklet.js']
        }
      }
    },

    bookmarklet: {
      inline: {
        options: { anonymize: false },
        files: {
          'build/bookmarklet.js': ['build/sumter.js']
        }
      },
      hosted: {
        options: { isTemplate: true },
        files: {
          'build/bookmarklet-hosted.js': ['build/bookmarklet-hosted.js']
        }
      }
    }

  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerMultiTask('bookmarklet', 'Generate bookmarklet', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      anonymize: true,
      isTemplate: false
    });

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

      // Process script as template.
      if(options.isTemplate) contents = grunt.template.process(contents);

      // Wrap in anonymous function.
      if(options.anonymize) contents = '(function(){;' + contents + ';})()';

      // Encode as URI.
      contents = encodeURI('javascript:' + contents);

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, contents);
      grunt.log.writeln('Created bookmarklet: ' + file.dest);

    });

  });

  grunt.registerTask('default', ['jshint', 'uglify', 'bookmarklet']);

};
