/**
 * Created by dd on 1/15/15.
 */

RuleTool = function(rule) {
    this.rule = null;
    if (rule) {
        this.rule = rule;
    } else {
        this.rule = {};
    }
    if (! this.rule.clauses) {
        this.rule.clauses = [];
    }
}

RuleTool.prototype.initializeIfQuery = function() {
    this.rule.ifQuery = {
        filtered : {
            query: { match_all: {} },
            filter: {
                nested: {
                    path: "data",
                    filter: {
                        bool: {
                            must: [],//here we have match, path_match, range, and other queries
                            must_not: []//here we have same types of queries, that have been NEGATED
                        }
                    }
                }
            }
        }
    };
};

/**
 * convert the providedinfo into a ElasticSearch query and save it in our rule
 * The clause object has these properties:
 * * pred - the predicate
 * * objs - an array of objects.  These are ORed together
 * * negated - if true, this clause will be added to the must_not query
 * @param clause
 */
RuleTool.prototype.addClause = function(clause) {
    this.rule.clauses.push(clause);
};

RuleTool.prototype.buildIfQuery = function() {
    RuleTool.prototype.initializeIfQuery();
    var clauseQueryObj = null;
    //loop thru each clause
    for (var ci in this.rule.clauses) {
        //for this clause, build a clauseQueryObj
        clauseQueryObj = {};
        clauseQueryObj.bool.should = [];

        var clause = this.rule.clauses[ci];
        if (! clause.pred || !clause.objs) continue;

        //build a line for each object
        for (var oi in clause.objs) {
            var obj = clause.objs[oi];
            var qry = {};
            if (obj.obj) {
                var path = "data";
                path += '["' + clause.pred + '"]';
                path += '["' + obj.obj.id + '"]';
                if (! obj.val) {
                    qry.path_match = path;
                }
                //TODO handle when obj has a value, operators, etc.
            }
            clauseQueryObj.bool.should.put(qry);
        }//next obj in this clause

        //clauseQueryObj completed.  put it in the right place
        RuleTool.prototype.getRuleClauses(clause.negated).put(clauseQueryObj);

    }//next clause
};

RuleTool.prototype.getRuleClauses = function(negated) {
    var clauses;
    var self = this;
    if (!negated) {
        clauses = self.rule.ifQuery.filtered.filter.nested.filter.bool.must;
    } else {
        clauses = self.rule.ifQuery.filtered.filter.nested.filter.bool.must_not;
    }
    return clauses;
};

RuleTool.prototype.prepareRule = function() {
    RuleTool.prototype.buildIfQuery();
    return this.rule;
};