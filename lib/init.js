
EasySearch.createSearchIndex('conditions', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
    'props' : {
        'etype' : 'health-condition' // demo purpose configuration, can be used in query
    },
    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});

EasySearch.createSearchIndex('symptoms', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
    'props' : {
        'etype' : 'health-symptom' // demo purpose configuration, can be used in query
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
        'etype' : 'medicine' // demo purpose configuration, can be used in query
    },
//    'limit'         : 20,                   // default: 10
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});