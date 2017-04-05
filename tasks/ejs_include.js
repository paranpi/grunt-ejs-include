var path = require('path');
module.exports = function(grunt) {


  /**
   * Resolve include `name` relative to `filename`.
   *
   * @param {String} name
   * @param {String} filename
   * @return {String}
   * @api private
   */

  function resolveInclude(name, filename) {
    var retPath = path.join(path.dirname(filename), name);
    var ext = path.extname(name);
    if (!ext) retPath += '.ejs';
    return retPath;
  }

  'use strict';
  grunt.registerMultiTask('ejs_include', 'concat ejs templates that will be included', function() {
    var options = this.options();
    grunt.verbose.writeflags(options, 'Options');
    function loadTemplate(filename) {
      grunt.log.debug('filename',filename);
      var template = grunt.file.read(filename);
      var replacedTemplate = template;
      var includeRegex = new RegExp(/\<\%-?\s*include\s*(\S+)\s*\%\>/g);
      var match,path;
      while (match = includeRegex.exec(template)) {
        path = resolveInclude(match[1],filename);
        //TODO: change replace to replaceAt to improve performance
        replacedTemplate = replacedTemplate.replace(match[0],loadTemplate(path));
      }
      return replacedTemplate;
    }
    this.files.forEach(function(file) {
      //var out = file.src.map(grunt.file.read).join('');
      file.src.forEach(function (filename){
        var replaced = loadTemplate(filename);
        grunt.log.debug('dest',file.dest);
        grunt.file.write(file.dest,replaced);
      });
    });

    grunt.log.ok('generated template');
  });
};
