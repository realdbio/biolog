
//TODO use filters like this http://matteodem.github.io/meteor-easy-search/docs/recipes/
EasySearch.createSearchIndex('conditions', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'syns', 'desc'],    // can also be an array of fields
    'props' : {
        'etypes' : 'health-condition' // demo purpose configuration, can be used in query
    },
//    'limit'         : 20,                   // default: 10
    'convertNumbers': false,
    'use'           : 'mongo-db'
//    'sort'          : function () {
//        return { 'name' : -1 };
//    }
});

EasySearch.createSearchIndex('symptoms', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'desc'],    // can also be an array of fields
    'props' : {
        'etypes' : 'health-symptom' // demo purpose configuration, can be used in query
    },
//    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});


EasySearch.createSearchIndex('medicines', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'desc'],    // can also be an array of fields
    'props' : {
        'etypes' : 'medicine' // demo purpose configuration, can be used in query
    },
//    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});