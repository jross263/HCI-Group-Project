const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const reportSchema = require('../schemas/reports');

class ReportStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });
        
        this.schemaValidator = ajv.compile(reportSchema);
        const dbPath = `${process.cwd()}/HWMonitorReports.db`;
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
    readAll() {
        return this.db.find()
    } 
    readAll(query) {
        return this.db.find(query)
    }  
}
module.exports = new ReportStore();