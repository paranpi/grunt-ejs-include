var path = require('path');
module.exports = function(grunt) {
  'use strict';
  grunt.registerMultiTask('ejs_include', 'concat ejs templates that will be included', function() {
    var baseOptions = this.options();
    grunt.verbose.writeflags(baseOptions, 'Options');
    function loadTemplate(filename,options) {
      grunt.log.debug('filename',filename);
      grunt.log.debug('options', options);
      var template = grunt.file.read(path.join(options.path,filename));
      var replacedTemplate = template;
      var includeRegex = new RegExp(/\<\%\sinclude\s(\S+)\s\%\>/g);
      var match;
      while (match = includeRegex.exec(template)) {
        replacedTemplate = template.replace(match[0],loadTemplate(match[1],options));
      }
      return replacedTemplate;
    }

    this.files.forEach(function(file) {
      grunt.log.debug('file',file);
      //var out = file.src.map(grunt.file.read).join('');
      baseOptions.filename = path.basename(file.src[0]);
      baseOptions.path = path.dirname(file.src[0]);

      var replaced = loadTemplate(baseOptions.filename,baseOptions);
      grunt.file.write(path.join(file.dest,baseOptions.filename),replaced);
      grunt.log.debug('replaced',replaced);
      grunt.log.ok('generated template');
    })
  });
};
