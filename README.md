smartbio
========

smart bio

To delete a collection
----------------------
db.entities.remove({})

Meteor References
----------
https://github.com/pahans/reactive-modal
https://github.com/matteodem/meteor-easy-search/wiki/Javascript-API
https://www.npmjs.com/package/csvtojson

Elasticsearch References
------------------------
http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-percolate.html
http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/mapping-nested-type.html

Health Info References
----------------------
http://www.nlm.nih.gov/research/umls/Snomed/cmt.html
http://wwwcf2.nlm.nih.gov/nlm_eresources/eresources/search_database.cfm
http://healthhotlines.nlm.nih.gov/subserch.html

To Do
-----
Add file upload support, images
https://github.com/CollectionFS/Meteor-CollectionFS

Add/update/delete current facts to patient entity
Rules schema, using Percolator syntax
Rules tooling

Run ElasticSearch locally
-------------------------
elasticsearch -f -D es.config=/usr/local/opt/elasticsearch/config/elasticsearch.yml

Install ElasticSearch admin interface
-------------------------------------
http://stackoverflow.com/questions/8954785/elastic-search-how-to-see-the-indexed-data