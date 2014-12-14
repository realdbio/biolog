Package.describe({
  name: 'ramshackle:smartbio',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.addFiles('ramshackle:smartbio.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ramshackle:smartbio');
  api.addFiles('ramshackle:smartbio-tests.js');
});
