var path = require('path');
module.exports = function(grunt) {
  'use strict';
  grunt.registerMultiTask('ejs_include', 'concat ejs templates that will be included', function() {
    var options = this.options();
    grunt.verbose.writeflags(options, 'Options');
    function loadTemplate(filename) {
      grunt.log.debug('filename',filename);
      var template;
      if(grunt.file.exists(path.join(options.path,filename))) {
        template = grunt.file.read(path.join(options.path,filename));
      }else {
        template = grunt.file.read(filename);
      }

      var replacedTemplate = template;
      var includeRegex = new RegExp(/\<\%-?\sinclude\s(\S+)\s\%\>/g);
      var match;
      while (match = includeRegex.exec(template)) {
        grunt.log.debug('match',match);
        replacedTemplate = replacedTemplate.replace(match[0],loadTemplate(match[1]));
      }
      return replacedTemplate;
    }
    this.files.forEach(function(file) {
      //var out = file.src.map(grunt.file.read).join('');
      file.src.forEach(function (filename,idx){
        options.path = path.dirname(filename);
        var replaced = loadTemplate(filename);
        grunt.log.debug('dest',file.dest);
        grunt.file.write(file.dest,replaced);
      });
    });

    grunt.log.ok('generated template');
  });
};
