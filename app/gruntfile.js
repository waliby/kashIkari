grunt.loadNpmTasks('grunt-rcedit');
//grunt.loadTasks('rcedit');
grunt.initConfig({
  rcedit: {
    exes: {
      files: [{
        expand: true,
        cwd: 'dist/',
        src: ['**/*.exe']
      }],
      options: {
        'icon': 'img/Artua-Mac-Intranet.ico',
        'file-version': '0.0.1',
        'product-version': '0.0.2',
        'version-string': {
          'CompanyName': 'CPLN Inc.',
          'LegalCopyright': 'Copyright 2015 Foobar Inc.'
        }
      }
    }
  }
});
