const Role = require('./EComponents').EntityRole;
const AgentType = require('./EComponents').AgentType;

class Document {
    constructor() {
        this.activities = [];
        this.entities = [];
        this.agents = [];
    }

    toString() {
        let filter = (key, value) => {
            let filterWords = ['parent', 'usage', 'created', 'owner', 'software'];
            if(filterWords.includes(key)) return 'OBJ> ' + value['id'];
            else return value;
        };

        let string = 'Document: \n';
        string += '-activities: ' + JSON.stringify(this.activities, filter, ' ') + '\n\n';
        string += '-agents: ' + JSON.stringify(this.agents, filter, ' ') + '\n\n';
        string += '-entities: ' + JSON.stringify(this.entities, filter, ' ')  + '\n\n';
        return string;
    }

    //ToDo: Replace empty objects with NULL
    addActivity(id, startTime, endTime, type, label) {
        try {
            let newActivity = {
                id: id,
                type: type ? type : null,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                label: label ? label : '',
                owner: {},
                software: {},
                organization: {}
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
            label: label ? label : ''
        };
        this.entities.push(newEntity);
    }

    setEntityRelation(entityId, role, parentActivity) {
        let entityIdx = this.entities.findIndex(entity => entity.id === entityId);
        let activityIdx = this.activities.findIndex(activity => activity.id === parentActivity);
        if(entityIdx === -1 || activityIdx === -1) {
            console.error('Could not find <id> in document!');
            return null;
        }
        //this.entities[entityIdx].role = role;
        if(role === Role.CREATION)
            this.activities[activityIdx].created = this.entities[entityIdx];
        else if(role === Role.CREATOR)
            this.activities[activityIdx].usage = this.entities[entityIdx];
        return this.entities[entityIdx];
    }

    /**
     * Activated through association <agent -> activity>
     */
    setAgentRelation(agentId, activityId, role) {
        let agentIdx = this.agents.findIndex(agent => agent.id === agentId);
        let activityIdx = this.activities.findIndex(activity => activity.id === activityId);
        if(agentIdx === -1 || activityIdx === -1) {
            console.error('Could not find <id> in document!');
            return null;
        }
        if(this.agents[agentIdx].type === AgentType.PERSON )
            this.activities[activityIdx].owner = this.agents[agentIdx];
        else if(this.agents[agentIdx].type === AgentType.ORGANIZATION)
            this.activities[activityIdx].organization = this.agents[agentIdx];
        else if(this.agents[agentIdx].type === AgentType.SOFTWARE_AGENT)
            this.activities[activityIdx].software = this.agents[agentIdx];
        //this.agents[agentIdx].role = role ? role : '';
        return this.agents[agentIdx];
    }

    /**
     * Activated through attribution <agent -> data>
     */
    setAgentEntityRelation(agentId, entityId) {
        let agentIdx = this.agents.findIndex(agent => agent.id === agentId);
        let entityIdx = this.entities.findIndex(entity => entity.id === entityId);
        if (agentIdx === -1 || entityIdx === -1) {
            console.error('Could not find <id> in document!');
            return null;
        }
        let corresActivity = [];
        for (let activity of this.activities) {
            if (activity.created.id === this.entities[entityIdx].id || activity.usage.id === this.entities[entityIdx].id) {
                corresActivity.push(activity);
            }
        }
        if (corresActivity.length > 0 && this.agents[agentIdx].type === AgentType.PERSON) {
            for(let cor of corresActivity) {
                cor.owner = this.agents[agentIdx];
            }
        } else if(corresActivity.length > 0 && this.agents[agentIdx].type == AgentType.ORGANIZATION) {
            for(let cor of corresActivity) {
                cor.organization = this.agents[agentIdx];
            }
        }
    }
}

module.exports = Document;