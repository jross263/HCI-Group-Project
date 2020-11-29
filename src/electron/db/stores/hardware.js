const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const hardwareSchema = require('../schemas/hardware');

class HardwareStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });
        
        this.schemaValidator = ajv.compile(hardwareSchema);
        const dbPath = `${process.cwd()}/HWMonitor.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }
    validate(data) {
        return this.schemaValidator(data);
    }

    create(data) {
        const isValid = this.validate(data);
        if (isValid) {
            return this.db.insert(data);
        }
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