
EasySearch.createSearchIndex('conditions', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'synonyms', 'description'],    // can also be an array of fields
//    'props' : {
//        'etypes' : 'health-condition' // demo purpose configuration, can be used in query
//    },
//    'limit'         : 20,                   // default: 10
    'convertNumbers': false,
    'use'           : 'mongo-db'
//    'sort'          : function () {
//        return { 'name' : -1 };
//    }
});

EasySearch.createSearchIndex('symptoms', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
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
    'field'         : ['name', 'description'],    // can also be an array of fields
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