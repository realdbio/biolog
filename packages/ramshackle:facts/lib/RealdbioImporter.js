/**
 * Created by dd on 11/23/14.
 */
RealdbioImporter = function(config) {
    var self = this;
    self.config = config;

};

/** import CSV/TSV/PSV/SSV data */
RealdbioImporter.prototype.import = function(data) {
    var self = this;
    var lines = data.split("\n");
    var entities = [];
    var facts = [];

    var etypeObjId = self.config.etypeId;
    if (etypeObjId == "newEtype") etypeObjId = null;
    if (! etypeObjId) etypeObjId = new Meteor.Collection.ObjectID()._str;
    var etypeObj = {
        _id: etypeObjId,
        name: self.config.etypeName
    };
    for (var li in lines) {
        var line = lines[li].trim();
        if (! line) continue;
        var cells = line.split(self.config.delimiter);
        if (!cells || cells.length == 0) continue;

        var entity = entities[li];
        if (! entity) {
            entity = {
                _id: new Meteor.Collection.ObjectID()._str,
                etype: etypeObj._id
            };
            entities.push(entity);

            //if facts already exist for this row, then update them with the new id
//                if (theFacts) {
//                    for (var fi in theFacts) {
//                        var fact = theFacts[fi];
//                        fact.subj = entity._id
//                    }
//                }
        }

        for (var ci in cells) {
//            var colEtype = self.config.dataColumns[ci].colEtype;
            var header = self.config.dataColumns[ci].header;
//            if (colEtype=="ignore") continue;

            var cell = cells[ci];
            if (!cell) continue;

            if (! facts[ci]) facts[ci] = [];
//            var theFacts = facts[ci];


            if (ci==0) {
                entity.title = cell;
                entities[li] = entity;
//            } else if (colEtype=="description" || colEtype=="synonym") {
//                var description = entity.description || "";
//                if (description && description.length > 0) description += "; ";
//                description += cell;
//                entity.description = description;
//                entities[li] = entity;
//            } else if (colEtype=="datum") {
            } else {
                var numericVal = null;
                if(isNumber(cell)) {
                    numericVal = cell;
                }
                var fact = {
                    subj: entity._id,
                    header: header,
//                    pred: header,
                    text: cell,
                    num: numericVal
                };
                facts[ci].push(fact);
            }
        }
    }

    var bulkData = {
        etypes: [etypeObj],
        entities: entities,
        facts: facts,
        strategies: [self.config]
    };

    console.log("bulkData=" + JSON.stringify(bulkData, "  "));
    //store entities and facts
    Meteor.call("bulkLoad", bulkData, function(error, result) {
        // display the error to the user and abort
        if (error)
            return console.log("Error calling bulkLoad: " + error.reason);
        console.log("bulkLoad returns: " + result);
    });
};