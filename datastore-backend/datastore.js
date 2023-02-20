const {Datastore} = require('@google-cloud/datastore');

const projectId ='job-tracker-db-378415';

// module.exports.Datastore = Datastore;
module.exports.datastore = new Datastore({projectId: projectId});
module.exports.fromDatastore = function fromDatastore(item){
    item.id = item[Datastore.KEY].id;
    return item;
}
