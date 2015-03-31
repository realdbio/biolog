


//TODO use filters like this http://matteodem.github.io/meteor-easy-search/docs/recipes/
EasySearch.createSearchIndex('conditions', {
    'collection'    : Entities,              // instanceof Meteor.Collection
    'field'         : ['name', 'synonyms', 'description'],    // can also be an array of fields
    'props' : {
        'etypes' : 'healthcondition' // demo purpose configuration, can be used in query
    },
//    'limit'         : 20,                   // default: 10
    'convertNumbers': false,
    'use'           : 'mongo-db'
//    'sort'          : function () {
//        return { 'name' : -1 };
//    }
});



EasySearch.createSearchIndex('predicates', {
    'collection'    : Predicates,              // instanceof Meteor.Collection
    'field'         : ['name', 'description'],    // can also be an array of fields
    'convertNumbers': true,
    'use'           : 'mongo-db',
    'sort'          : function () {
        return { 'name' : -1 };
    }
});


getPatientDiagnoses = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: "diagnosis", subj: patientId, valid: 1 });
};


getPatientFlags = function(patientId) {
    if (! patientId) return;
    return Facts.find({pred: "flag", subj: patientId, valid: 1 });
};

//TODO support users being permitted to handle other patients
getUserPatients = function(userid) {
    if (! userid) return;
    return Entities.find({etypes: "patient", owners: userid, valid: 1 });
};


EasySearch.createSearchIndex('entities', {
    field : ['name', 'synonyms', 'description'],
    collection : Entities,
    props : {
        'filteredCategories' : []
    },
    use: "mongo-db",
    //'use': 'elastic-search',
    transform: function (doc) {
        console.log("indexing doc: " + JSON.stringify(doc));
        //doc.etypes = ['health-condition'];
    },
    query : function (searchString) {
        //console.log("entities index: filteredCategories=" + this.props.filteredCategories);

        // Default query that will be used for searching
        var qry = {};

        // filter for categories if set
        if (this.props.filteredCategories.length > 0) {
            qry.etypes = { $in : this.props.filteredCategories };
            return qry;
            //if (this.props.filteredCategories.length > 0) {
            //    qry = {
            //        filtered: {
            //            query: {
            //                fuzzy_like_this: {
            //                    fields: ["name", "synonyms", "description"],
            //                    like_text: searchString
            //                }
            //            },
            //            filter: {
            //                term: {etypes: this.props.filteredCategories}
            //                //terms: { etypes: ["health-condition"]}
            //            }
            //        }
            //    };
            //    //console.log("qry=" + JSON.stringify(qry));
            //    return qry;
            //}
        }
    }
});
