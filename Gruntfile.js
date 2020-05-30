module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coveralls: {
      options: {
        force: false,
      },

      main: {
        src: 'reports/coverage/lcov.info',
        options: {},
      }
    },
  });

  grunt.loadNpmTasks('grunt-coveralls');

  // Default task(s).
  grunt.registerTask('default', ['coveralls']);

};
