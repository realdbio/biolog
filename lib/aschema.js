//define schema for facts and related classes

Units = new Mongo.Collection("units");
Measures = new Mongo.Collection("measures");
Entities = new Mongo.Collection("entities");
Etypes = new Mongo.Collection("etypes");
Predicates = new Mongo.Collection("predicates");
Sources = new Mongo.Collection("sources");
Facts = new Mongo.Collection("facts");
Votes = new Mongo.Collection("votes");
Lists = new Mongo.Collection("lists");
Mappings = new Mongo.Collection("mappings");
Strategies = new Mongo.Collection("strategies");
//Items = new Mongo.Collection("items");

var Schemas = {};

Schemas.Unit = new SimpleSchema({
    name: { type: String }, //the canonical name
    abbrev: { type: String, optional: true }, //the abbreviation
    convert: { type: Number, optional: true } //multiply this a value with the current unit by this value to get its canonical value
});
Units.attachSchema(Schemas.Unit);

Schemas.Measure = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    units: { type: [ Schemas.Unit ] }
});
Measures.attachSchema(Schemas.Measure);

Schemas.Etype = new SimpleSchema({
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, label: "Description", optional: true }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Etypes.attachSchema(Schemas.Etype);

Schemas.Entity = new SimpleSchema({
    _id: { type: String, index: 1 },
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    synonyms: {type: [String]}, //other names for this
    description: { type: String, label: "Description", optional: true }, //the description
    etypes: { type: [String]}, //the types of this entity
    parents: { type: [String]}, //the parents
    src: { type: String, optional: true }, //the data source that this fact came in,
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    used: { type: Number, defaultValue: 0, index: -1 }, //number of times this is referenced by facts
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Entities.attachSchema(Schemas.Entity);

Schemas.Predicate = new SimpleSchema({
    _id: { type: String, index: 1 },
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    measure: { type: String, optional: true }, //the type of measure, if any
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true, index: 1 },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Predicates.attachSchema(Schemas.Predicate);

Schemas.Source = new SimpleSchema({
    _id: { type: String, index: 1 },
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, label: "Description" }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Sources.attachSchema(Schemas.Source);

/**
 * Facts contain data.  They are
 *  * validatable - people can indicate their validity
 *  * probabilistic - likelihood of truth is calculable
 *  * flaggable - using rules
 *  * compound - can contain other sub-facts, which describe this fact (e.g. duration of a symptom) OR the parent (systolic or diastolic)
 * @type {SimpleSchema}
 */
Schemas.Fact = new SimpleSchema({
    _id: { type: String, index: 1 },
    subj: { type: String, index: 1, optional: true }, //the subject
    header: { type: String, index: 1, optional: true }, //the header before mapping to a predicate id
    pred: { type: String, index: 1 } , //the predicate
    obj: { type: String, optional: true, index: 1 }, //the object
    etype: { type: String, optional: true, index: 1 }, //the type of entity
    props: { type: [Schemas.Fact], optional: true }, //sub-facts
    text: { type: String, optional: true }, //the string value
    num: { type: Number, optional: true }, //the numeric value
    unit: { type: String, optional: true }, //the unit of measure for this fact
    mes: { type: String, optional: true }, //the type of measurement,
    norm: { type: Number, optional: true }, //the normalized value (normalized to the canonical unit for that measure
    nunt: { type: String, optional: true }, //the canonical unit for that normalized measure
    sdt: { type: Date, optional: true, index: -1 }, //the start date
    sdf: { type: Number, defaultValue: 0, index: 1 }, //the start date flag.  0=no comment.  1=beginning of time
    edt: { type: Date, optional: true, index: -1 }, //the end date
    edf: { type: Number, defaultValue: 0, index: 1 }, //the end date flag.  0=no comment.  1=forever
    src: { type: String }, //the data source that this fact came in,
    tvotes: { type: Number, defaultValue: 0 }, //number of votes that this is true
    fvotes: { type: Number, defaultValue: 0 }, //number of votes that this is false
    truth: { type: Number, optional: true, defaultValue: 1.0, index: 1 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
    validity: { type: Number, defaultValue: 0, index: 1 }, //the validity score of the data
    current: { type: Number, defaultValue: 1, index: 1 }, //1=current, 0=superseded by new info
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }

});
Facts.attachSchema(Schemas.Fact);

Schemas.Vote = new SimpleSchema({
    fact: { type: Schemas.Fact, index: 1 }, //the fact that the vote applies to
    vtype: { type: String, allowedValues: ['TRUE', 'FALSE', 'GOOD', 'BAD'], index: 1 }, //the type: TRUE, FALSE, GOOD, BAD, ...
    text: { type: String, optional: true }, //a text value if any
    num: { type: Number, optional: true, index: 1 }, //the numeric value
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 }
});
Votes.attachSchema(Schemas.Vote);

/**
 * An Item is an item in a List.  It is intended to represent a single entity
 * An Item contains a list of facts (properties + values) associated with that entity.
 * So an item represents an entity with a subset of its fields.
 * @type {SimpleSchema}
 */
Schemas.Item = new SimpleSchema({
    subj: { type: Schemas.Entity, optional: true }, //the subject if there is 1.  Usually there is 1
    etype: { type: Schemas.Etype, optional: true }, //the type of entity if there is 1.  Usually there is 1
    name: { type: String, label: "Name", optional: true },
    description: { type: String, label: "Description", optional: true }, //the description
    facts: { type: [Schemas.Fact] }
});

/**
 * A List is a list of items.
 * It can be saved from a search in the realdb UI
 * It contains a static list of items.
 * It also contains a map of all Entities referenced (as subjects or as objects) and all Predicates used.
 * It can be regenerated when data changes
 * @type {SimpleSchema}
 */
Schemas.List = new SimpleSchema({
    name: { type: String, label: "Name" },
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, label: "Description" }, //the description
    etype: { type: Object }, //the type of items.  key=type id, value=Etype object
    entities: { type: Object }, //the entities within the items.  key=entity id, value=Entity object
    properties: { type: Object }, //the predicates within the items.  key=predicate id, value=Predicate object
    items: { type: [Schemas.Item] },//the items within the list
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String },
    version: { type: Number } //the version number
});
Lists.attachSchema(Schemas.List);

Schemas.Mapping = new SimpleSchema({
    mtype: { type: String, allowedValues: ['Etype', 'Entity', 'Predicate'], index: 1 }, //the type: TRUE, FALSE, GOOD, BAD, ...
    text: { type: String, index: 1 }, //the text value that is mapped
    textLC: { type: String, index: 1 }, //lower case of the text value that is mapped
    etype: { type: String, optional: true }, //the type this maps to
    entity: { type: String, optional: true }, //the entity this maps to
    pred: { type: String, optional: true }, //the predicate this maps to
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    used: { type: Date, optional: true }, //date last used
    useCount: { type: Number, index: -1, defaultValue: 0 }, //number of times this mapping has been used
    creator: { type: String, index: 1 }
});
Mappings.attachSchema(Schemas.Mapping);

Schemas.Strategy = new SimpleSchema({
    headers: { type: String, index: 1 }, //the header line
    headersLC: { type: String, index: 1 }, //header line converted to lower case
    headerMappings: { type: Object, optional: true }, //key=header lower case, value=Mapping object
    rowMappings: { type: Object, optional: true }, //lower case of the text value that is mapped
//    startDate: { type: Date, optional: true }, //if there is a global start date for this import
//    beginningOfTime: {type: Boolean, optional: true}, //if true, mark as beginning of time
//    endDate: { type: Date, optional: true }, //if there is a global end date for this import
//    eternity: {type: Boolean, optional: true}, //if true, mark as forever
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    used: { type: Date, optional: true }, //date last used
    useCount: { type: Number, index: -1, defaultValue: 0 }, //number of times this strategy has been used
    creator: { type: String, index: 1 }
});
Strategies.attachSchema(Schemas.Strategy);
