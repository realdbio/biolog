/**
 * Created by dd on 1/27/15.
 */


Router.configure({
    layoutTemplate: 'layout'  //can be any template name
});

Router.map(function(){
    this.route('console', {path: '/'} );
    this.route('rule');
});