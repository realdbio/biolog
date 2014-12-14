Package.describe({
  name: 'ramshackle:facts',
  summary: 'defines Fact schema and functions for working with facts',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.4');
  api.use(
      ['mongo', 'aldeed:collection2', 'accounts-base', 'matteodem:easy-search', 'peerlibrary:async', 'sergeyt:typeahead'],
      ['client', 'server']
  );

    api.use(
        ['templating', 'mizzao:bootstrap-3', 'less', 'tsega:bootstrap3-datetimepicker'],
        ['client']
    );


    api.addFiles(
        ['lib/schema.js',
            'lib/init.js',
            'lib/util.js',
            'lib/RealdbioImporter.js'],
        ['client', 'server']
    );

    api.addFiles(
        [
            'client/init-client.js',
            'client/entity.html',
            'client/entity.js',
            'client/etype.html',
            'client/etype.js',
            'client/dataloader.html',
            'client/dataloader.js'],
        ['client']
    );

    api.addFiles(
        [
            'server/init-server.js',
            'server/methods.js',
        ],
        ['server']
    );

//    api.addFiles(
//        ['ramshackle:facts.js', 'views/entity.js'],
//        ['server']);

    api.export(['Units', 'Entities', 'Predicates'
        , 'Measures', 'Source', 'Fact', 'Vote']
    );
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('aldeed:simple-schema');
  api.use('aldeed:collection2');
  api.use('ramshackle:facts');
  api.use('matteodem:easy-search');
  api.addFiles('test/ramshackle:facts-tests.js');
});
