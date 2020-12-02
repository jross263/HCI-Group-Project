const Datastore = require('nedb-promises');

class HardwareStore {
    constructor() {        
        const dbPath = `${process.cwd()}/HWMonitor.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }

    create(data) {       
        return this.db.insert(data);        
    }
    delete(id){
        return this.db.remove({_id: id})
    }
    read(_id) {
        return this.db.findOne({_id}).exec()
    }
    update(updateArray){
        return this.db.update({ _id: updateArray[0] },updateArray[1])
    }
    readAll() {
        return this.db.find()
    }
    readAll(query) {
        return this.db.find(query)
    }  
}
module.exports = new HardwareStore();