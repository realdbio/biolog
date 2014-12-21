
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


CsvLoader.prototype.loadKaiserJson = function(map, json, src, callback) {
    console.log("Loading " + json.length + " Kaiser entities...");
    for (var i in json) {
        var item = json[i];
        var name = item[map.name];
        if (!name) {
            name = item[map.altName];
        }
        var nameLC = name;
        if (typeof name == "string") nameLC = name.toLowerCase();
        var entity = {
            name: name,
            nameLC: nameLC,
            src: "kaiser/cmt/" + src,
            local: item[map.local],
            created: new Date(),
            creator: "dave",
            synonyms: []
        };
        for (var si in map.synonyms) {
            var synonymField = map.synonyms[si];
            var synLC = String(item[synonymField]);
//            if (typeof synLC == "string")
            synLC = synLC.toLowerCase();
            entity.synonyms.push(synLC);
        }
        //does it already exist?

        var alreadyExisting = Entities.findOne({nameLC: nameLC});
        if (alreadyExisting) {
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
                Entities.update({_id: alreadyExisting._id}, {$set: {synonyms: alreadyExisting.synonyms}});
            } else {
                console.log(i + ") SKIPPING ALREADY EXISTS: '" + name + "'");
            }

            continue;
        }
//        console.log(i + ") Save entity: " + JSON.stringify(entity));
        Entities.insert(entity);
    }
    callback();
};