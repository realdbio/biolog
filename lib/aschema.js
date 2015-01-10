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
Rules = new Mongo.Collection("rules");
Questions = new Mongo.Collection("questions");
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
    valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true }
});
Etypes.attachSchema(Schemas.Etype);

Schemas.Entity = new SimpleSchema({
    _id: { type: String, index: 1 },
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    synonyms: {type: [String], optional: true}, //other names for this
    description: { type: String, label: "Description", optional: true }, //the description
    etypes: { type: [String]}, //the types of this entity
    parents: { type: [String], optional: true}, //the parents
    source: { type: String, optional: true }, //the data source that this fact came in,
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    data: { type: Object, optional: true, blackbox: true, index: 1 },//current facts tagged to this entity
    valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    used: { type: Number, defaultValue: 0, index: -1 }, //number of times this is referenced
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true }
});
Entities.attachSchema(Schemas.Entity);

Schemas.Predicate = new SimpleSchema({
    _id: { type: String, index: 1 },
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, optional: true, label: "Description" }, //the description
    etypes: { type: [String], optional: true }, //the etypes to which this predicate might be applied
    measure: { type: String, optional: true }, //the type of measure, if any
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true }
});
Predicates.attachSchema(Schemas.Predicate);

//TODO use entities instead, remove this
Schemas.Source = new SimpleSchema({
    _id: { type: String, index: 1 },
    name: { type: String, label: "Name" }, //the canonical name
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, label: "Description" }, //the description
    uri: { type: String, optional: true }, //the RDF URI
    ns: { type: String, optional: true }, //the RDF namespace
    local: { type: String, optional: true }, //the RDF local name
    valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true }
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
    subjName: { type: String, optional: true }, //display name of the subject
    header: { type: String, index: 1, optional: true }, //the header before mapping to a predicate id
    pred: { type: String, index: 1 } , //the predicate
    obj: { type: String, optional: true, index: 1 }, //the object
    objName: { type: String, optional: true }, //display name of the object
//    ftype: { type: String, allowedValues: ["datum", "rule"], index: 1 }, //the type of fact
    etype: { type: String, optional: true, index: 1 }, //the type of entity
    props: { type: [Schemas.Fact], optional: true }, //sub-facts
    text: { type: String, optional: true }, //the string value
    num: { type: Number, optional: true }, //the numeric value
    unit: { type: String, optional: true }, //the unit of measure for this fact
    measure: { type: String, optional: true }, //the type of measurement,
    normVal: { type: Number, optional: true }, //the normalized value (normalized to the canonical unit for that measure
    normUnit: { type: String, optional: true }, //the canonical unit for that normalized measure
    startDate: { type: Date, optional: true, index: -1 }, //the start date
    startFlag: { type: Number, defaultValue: 0, index: 1 }, //the start date flag.  0=no comment.  1=beginning of time
    endDate: { type: Date, optional: true, index: -1 }, //the end date
    endFlag: { type: Number, defaultValue: 0, index: 1 }, //the end date flag.  0=no comment.  1=forever
    source: { type: String }, //the data source that this fact came in,
    trueVotes: { type: Number, defaultValue: 0 }, //number of votes that this is true
    falseVotes: { type: Number, defaultValue: 0 }, //number of votes that this is false
    truth: { type: Number, optional: true, defaultValue: 1.0, index: 1 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
    valid: { type: Number, defaultValue: 1, index: 1 }, //the validity score of the data.  1=valid, 0=invalid
    used: { type: Number, defaultValue: 0, index: -1 }, //number of times this is referenced by facts
    current: { type: Number, defaultValue: 1, index: 1 }, //1=current, 0=superseded by new info
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    outdated: { type: Date, optional: true },
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true },
    outdater: { type: String, index: 1, optional: true },
    supersededBy: { type: String, optional: true }, // the fact that supersedes this one
    editors: { type: [String], index:1, optional: true }

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
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true }
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
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true },
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
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true },
    used: { type: Date, optional: true }, //date last used
    useCount: { type: Number, index: -1, defaultValue: 0 } //number of times this mapping has been used
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
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true },
    used: { type: Date, optional: true }, //date last used
    useCount: { type: Number, index: -1, defaultValue: 0 } //number of times this strategy has been used
});
Strategies.attachSchema(Schemas.Strategy);


/**
 * Rules add a fact about an entity when true.
 * That fact can have a staic or dynamic value
 * @type {SimpleSchema}
 */
Schemas.Rule = new SimpleSchema({
    _id: { type: String, index: 1 }, //convention is main-etype/key, example patient/bmi
    name: { type: String, label: "Name" },
    nameLC: { type: String }, //lower case version of the canonical name
    description: { type: String, label: "Description" }, //the description
    etypes: { type: [String], optional: true, index: 1 }, //the types of entities this can be applied to
    inputs: { type: [String], optional: true, index: 1 }, //the input properties that this rule requires
    query: { type: Object, blackbox: true }, //the percolator query
    addPred: { type: String, index: 1 } , //the predicate to apply when the rule applies
    assignType: { type: String, allowedValues: ["ADD", "SET"], defaultValue:"ADD" }, //if SET, overwrite other values for the same predicate
    assignObj: { type: String, optional: true, index: 1 }, //the object to assign when the rule applies
    assignText: { type: String, optional: true, index: 1 }, //the static string value to assign when the rule applies
    assignNum: { type: Number, optional: true, index: 1 }, //the static numeric value to assign when the rule applies
//    assignFormula: { type: String, optional: true, index: 1 }, //the formula to calculate the value, when the rule applies
    assignFn: { type: Object, optional: true, index: 1 }, //the function to calculate the value, when the rule applies
//    startDate: { type: Date, optional: true, index: -1 }, //the start date
//    startFlag: { type: Number, defaultValue: 0, index: 1 }, //the start date flag.  0=no comment.  1=beginning of time
//    endDate: { type: Date, optional: true, index: -1 }, //the end date
//    endFlag: { type: Number, defaultValue: 0, index: 1 }, //the end date flag.  0=no comment.  1=forever
    source: { type: String }, //the data source that this rule came from,
    votesT: { type: Number, defaultValue: 0 }, //number of votes that this is true
    votesF: { type: Number, defaultValue: 0 }, //number of votes that this is false
    truth: { type: Number, optional: true, defaultValue: 1.0, index: 1 }, //an estimation of the truth, 0-1, that is computed and updated, based on credentials of those who voted
    valid: { type: Number, defaultValue: 0, index: 1 }, //the validity score of the data
    current: { type: Number, defaultValue: 1, index: 1 }, //1=current, 0=superseded by new rule
    created: { type: Date, defaultValue: new Date() },
    updated: { type: Date, optional: true },
    deleted: { type: Date, optional: true },
    creator: { type: String, index: 1 },
    updater: { type: String, index: 1, optional: true },
    deleter: { type: String, index: 1, optional: true }
});
Rules.attachSchema(Schemas.Rule);

