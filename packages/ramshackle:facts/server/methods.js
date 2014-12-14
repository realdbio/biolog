Meteor.methods({
    addEntity: function (entity) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        entity.created = new Date();
        entity.creator = Meteor.userId();

        Entities.insert(entity);
    },

    addEtype: function (etype) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        etype.created = new Date();
        etype.creator = Meteor.userId();

        Etypes.insert(etype);
    },

    /**
     * Do this before we load the data.  Prepare the data
     * @param str the raw CSV/TSV/;SV/|SV data
      */
    preLoad: function(str) {

    },

//    bulkLoad: function(data) {
//        //TODO security!  Who is allowed, how many may they load
//        console.log("Bulk Loading data: " + JSON.stringify(data));
//
//        //store etypes
//        for (var i in data.types) {
//            var obj = data.types[i];
//            if (!obj) continue;
//            obj.creator = Meteor.userId();
//            obj.created = new Date();
//            obj.updated = new Date();
//            obj.validity = 0;
//            Etypes.insert(obj);
//        }
//
//        //store entities
//        for (var i in data.entities) {
//            var obj = data.entities[i];
//            if (!obj) continue;
//            obj.creator = Meteor.userId();
//            obj.created = new Date();
//            obj.updated = new Date();
//            obj.validity = 0;
//            Entities.insert(obj);
//        }
//
//        //store facts
//        for (var i in data.facts) {
//            var obj = data.facts[i];
//            if (!obj) continue;
//            obj.creator = Meteor.userId();
//            obj.created = new Date();
//            obj.updated = new Date();
//            obj.validity = 0;
//            Facts.insert(obj);
//        }
//    },

    lookupStrategy: function(info) {
        //first see if we have matching Strategy.  If found, return it
        Strategies.find({headersLC: info.headersLC}, function (err, response) {
            if (err) {
                console.log("lookupMappings error: " + err);
                return null;
            } else {
                console.log("Found strategies: " + JSON.stringify(response));
                if (response.data) {
                    var payload = {
                        strategies: response.data
                    };
                    return payload;
                }
            }
        });
    },

    lookupHeaderMappings: function(headers) {
        // Find any matching Mappings
        var q = async.queue(lookupHeaderMapping, 5);
        var mappings = {};
        //this will execute when finished
        q.drain = function() {
            console.log('all headers have been looked up');
            var payload = {
                headerMappings: mappings
            };
            return payload;
        };

        //start the queue with all headers
        q.push(headers, function(err, mapping) {
            if (err) {
                console.log("lookupHeaderMappings error: " + err);
            }
            mappings[mapping.text] = mapping.values;
        });
    },

    lookupRowMappings: function(rows) {
        // Find any matching Mappings
        var q = async.queue(lookupRowMapping, 5);
        var mappings = {};
        //this will execute when finished
        q.drain = function() {
            console.log('all rows have been looked up');
            var payload = {
                rowMappings: mappings
            };
            return payload;
        };

        //start the queue with all headers
        q.push(rows, function(err, mapping) {
            if (err) {
                console.log("lookupRowMappings error: " + err);
            }
            mappings[mapping.text] = mapping.values;
        });
    },

    //TODO run on server only
    importStrategyData: function(payload) {
        var s = payload.strategy;

        console.log("Received Strategy: " + JSON.stringify(s));
        //TODO see if this strategy has been stored. If not, store it

        var etypeId = s.etypeId;
        if (etypeId=="newEtype") etypeId = null;
        console.log("old etypeId=" + etypeId);
        if (! etypeId) {
            etypeId = new Meteor.Collection.ObjectID()._str;
            console.log("new etypeId=" + etypeId);
        }
        var etype = {
            _id: etypeId,
            name: s.etypeName,
            nameLC: s.etypeName.toLowerCase(),
            updated: new Date(),
            creator: Meteor.userId()
        };
        var existingEtype = Etypes.findOne(etypeId);
        if (!existingEtype) {
            Etypes.insert(etype);
        }

        //Import Col Mappings
        for (var ci in s.headerMappings) {
            var headerMapping = s.headerMappings[ci];
            if (! headerMapping) {
                console.log("No header mapping for column index=" + ci);
                continue;
            }
            var pred;
            if (! headerMapping.pred) {
                //this row has no predicate.  continue;
                //TODO in the future, require mappings to be specified
                pred = {
                    _id: new Meteor.Collection.ObjectID()._str,
                    name: headerMapping.text,
                    nameLC: headerMapping.text.toLowerCase(),
                    updated: new Date(),
                    creator: Meteor.userId()
                };
                Predicates.insert(pred);
                headerMapping.pred = pred._id;
                console.log("No header mapping to pred mapping specified so far mapping=" + JSON.stringify(headerMapping));
            } else {
                pred = Predicates.findOne(headerMapping.pred);
                if (! pred) {
                    pred = {
                        _id: headerMapping.pred,
                        name: headerMapping.text,
                        nameLC: headerMapping.text.toLowerCase(),
                        updated: new Date(),
                        creator: Meteor.userId()
                    };
                    Predicates.insert(pred);
//                    headerMapping.pred = pred._id;
                }
                //TODO populate pred.lastUsed
            }

            //TODO only store if such a mapping (this name to this predicate) does not exist.
            //store the mapping
            headerMapping.mtype = "Predicate";
            headerMapping.created = new Date();
            headerMapping.creator = Meteor.userId();
            headerMapping.updated = new Date();
            headerMapping.textLC = headerMapping.text.toLowerCase();
            console.log("insert headerMapping #" + ci + ": " + JSON.stringify(headerMapping));
            Mappings.insert(headerMapping);
        }

        //Import Row Mappings
        for (var ri in s.rowMappings) {
            var rowMapping = s.rowMappings[ri];
            if (! rowMapping) {
                console.log("No row mapping for row index=" + ri);
                continue;
            }
            rowMapping.mtype = "Entity";
            rowMapping.created = new Date();
            rowMapping.creator = Meteor.userId();
            rowMapping.updated = new Date();
            rowMapping.textLC = rowMapping.text.toLowerCase();
            var subject;
            if (! rowMapping.entity) {
                //this row has no entity.  continue;
                //TODO in the future, require mappings to be specified
                subject = {
                    _id: new Meteor.Collection.ObjectID()._str,
                    name: rowMapping.text,
                    nameLC: rowMapping.textLC,
                    updated: new Date(),
                    creator: Meteor.userId()
                };
                rowMapping.entity = subject._id;
                Entities.insert(subject, function(err, newId) {
                    if (err) {
                        console.log("Insert Rows A: Error inserting new subject: " + JSON.stringify(subject) + "\n" + err);
                        return;
                    }

                    //TODO only store if such a mapping (this name to this entity) does not exist.
                    //store the mapping
                    console.log("inserting rowMapping: " + JSON.stringify(rowMapping));
                    Mappings.insert(rowMapping);
                });

            } else {
                subject = Entities.findOne(rowMapping.entity);
                if (! subject) {
                    subject = {
                        _id: rowMapping.entity,
                        name: rowMapping.text,
                        nameLC: rowMapping.text.toLowerCase(),
                        updated: new Date(),
                        creator: Meteor.userId()
                    };
                    Entities.insert(subject, function(err, newId) {
                        if (err) {
                            console.log("Insert Rows B: Error inserting new subject: " + JSON.stringify(subject) + "\n" + err);
                            return;
                        }
                        //TODO only store if such a mapping (this name to this entity) does not exist.
                        //store the mapping
                        console.log("inserting rowMapping: " + JSON.stringify(rowMapping));
                        Mappings.insert(rowMapping);
                    });
                }
            }
        }

        //Import data
        for (var ri in s.rowMappings) { //for each row...
            var rowMapping = s.rowMappings[ri];
            var rowData = s.rowData[rowMapping.dataRowIndex];
            console.log("rowData=" + rowData);
            var subjectId = rowMapping.entity;
            for (var hi in s.headerMappings) { //for each header, make a Fact and save it
//                console.log(hi + ")rowData[hi]=" + rowData[hi]);
                var headerMapping = s.headerMappings[hi];
                console.log(hi + ") headerMappings[hi]=" + JSON.stringify(headerMapping));
                var predId = headerMapping.pred;
                var txt = rowMapping.text;
                var sdf = (s.beginningOfTime) ? 1 : 0;
                var edf = (s.eternity) ? 1 : 0;
                var fact = {
                    subj: subjectId,
                    header: txt,
                    pred: predId,
                    etype: etypeId,
                    text: rowData[hi],
                    src: "importStrategyData",
                    sdt: s.startDate,
                    sdf: sdf,
                    edt: s.endDate,
                    edf: edf,
                    updated: new Date(),
                    creator: Meteor.userId()
                };
                console.log("Inserting fact: " + JSON.stringify(fact));
                Facts.insert(fact);
            }
        }
    }
});


