const Role = require('./EComponents').EntityRole;

class Document {
    constructor() {
        this.activities = [];
        this.entities = [];
        this.agents = [];
    }

    toString() {
        return 'Document: \n';
    }

    addActivity(id, startTime, endTime, label) {
        try {
            let newActivity = {
                id: id,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                label: label ? label : ''
            };
            this.activities.push(newActivity);
        } catch (e) {
            throw new Error('Invalid date format in input file');
        }
    }

    addAgent(id, type, label, device) {
        let newAgent = {
            id: id,
            type: type,
            label: label ? label : '',
            device: device ? device : ''
        };
        this.agents.push(newAgent);
    }

    addEntity(id, type, role, label) {
        let newEntity = {
            id: id,
            type: type,
            label: label ? label : '',
            role: role ? role : Role.UNKNOWN
        };
        this.entities.push(newEntity);
    }

    setEntityRelation(id, role, parentActivity) {
        let index = this.entities.findIndex(entity => entity.id==id);
        if(index == -1) 
            return null;
        this.entities[index].role = role;
        this.entities[index].parent = parentActivity;
        return this.entities[index];
    }
}

module.exports = Document;