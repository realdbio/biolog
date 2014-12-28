
// Constructor
CsvLoader = function(path) {
    // always initialize all instance properties
    this.path = path;
    this.delim = ','; // default value
};

// class methods
CsvLoader.prototype.convertToJson = function(callback) {
    var fs = Npm.require("fs");
    var Converter = Meteor.npmRequire('csvtojson').core.Converter;
    var csvConverter = new Converter({constructResult:true});

    var readStream = fs.createReadStream(this.path);

    //end_parsed will be emitted once parsing finished
    csvConverter.on("end_parsed",function(jsonObj){
        callback(jsonObj); //here is your result json object
    });

    readStream.on('error', function (error) {
        return console.log("CsvLoader.readStream error: ", error);
    });

    readStream.on('readable', function() {
        //read from file
        readStream.pipe(csvConverter);
    });

};

CsvLoader.prototype.getEntityIdFromKaiserCode = function(kaiserCode) {
    var entity = Entities.findOne({local: "kaiser/cmt/" + kaiserCode});
    if (entity) return entity._id;
};

CsvLoader.prototype.loadKaiserJson = function(map, json, src, callback) {
    console.log("Loading " + json.length + " Kaiser entities...");
    var self = this;
    for (var i in json) {
        var item = json[i];
        var name = String(item[map.name]);
        if (!name) {
            name = String(item[map.altName]);
        }
        var nameLC = name;
        nameLC = name.toLowerCase();
        var id = "health-condition/" + strToId(nameLC);
        var theDate = new Date();
        var entity = {
            _id: id,
            name: name,
            nameLC: nameLC,
            src: "kaiser/cmt/" + src,
            local: "kaiser/cmt/" + item[map.local],
            created: theDate,
            creator: "dave",
            updated: theDate,
            updater: "dave",
            synonyms: [],
            parents: [],
            etypes: ["health-condition"]
        };

        //add synonyms
        for (var si in map.synonyms) {
            var synonymField = map.synonyms[si];
            var synLC = String(item[synonymField]);
            synLC = synLC.toLowerCase();
            entity.synonyms.push(synLC);
        }

        //add parents
//        var parents = [];
        if (item["parent_sctid"] && item["parent_sctid"] != null && item["parent_sctid"] != "null") {
            var parentId = this.getEntityIdFromKaiserCode(item["parent_sctid"]);
            if (parentId) entity.parents.push(parentId);
        }
        if (item["parent_sctid_2"] && item["parent_sctid_2"] != null && item["parent_sctid_2"] != "null") {
            var parentId = this.getEntityIdFromKaiserCode(item["parent_sctid_2"]);
            if (parentId) entity.parents.push(parentId);
        }
        if (item["parent_sctid_3"] && item["parent_sctid_3"] != null && item["parent_sctid_3"] != "null") {
            var parentId = this.getEntityIdFromKaiserCode(item["parent_sctid_3"]);
            if (parentId) entity.parents.push(parentId);
        }
//        if (parents) entity.parents = parents;

        //does it already exist?  If so just add synonyms and parents to the existing
        var alreadyExisting = Entities.findOne(id);
        if (alreadyExisting) {

            //todo add parents
            var addedParents = false;
//            for (var syni in entity.synonyms) {
//                if (! entity.synonyms[syni]) continue;
//                if (_.contains(alreadyExisting.synonyms, entity.synonyms[syni])) continue;
//                addedSynonyms = true;
//                alreadyExisting.synonyms.push(entity.synonyms[syni]);
//            }
            var combinedParents = _.union(alreadyExisting.parents, entity.parents);
            if (alreadyExisting.parents.length != combinedParents.length) {
                addedParents = true;
                alreadyExisting.parents = combinedParents;
            }
            if (addedParents) {
                console.log(i + ") ADDED PARENTS TO ALREADY EXISTING; now=" + JSON.stringify(alreadyExisting));
                Entities.update({_id: id}, {$set: {parents: alreadyExisting.parents}});
            }

            var addedSynonyms = false;
//            for (var syni in entity.synonyms) {
//                if (! entity.synonyms[syni]) continue;
//                if (_.contains(alreadyExisting.synonyms, entity.synonyms[syni])) continue;
//                addedSynonyms = true;
//                alreadyExisting.synonyms.push(entity.synonyms[syni]);
//            }
            var combinedSynonyms = _.union(alreadyExisting.synonyms, entity.synonyms);
            if (alreadyExisting.synonyms.length != combinedSynonyms.length) {
                addedSynonyms = true;
                alreadyExisting.synonyms = combinedSynonyms;
            }
            if (addedSynonyms) {
                console.log(i + ") ADDED SYNONYMS TO ALREADY EXISTING; now=" + JSON.stringify(alreadyExisting));
                Entities.update({_id: id}, {$set: {synonyms: alreadyExisting.synonyms}});
            }

            continue;
        }
//        console.log(i + ") Save entity: " + JSON.stringify(entity));
        Entities.insert(entity);
    }
    callback();
};