const AParser = require('./AParser');
const Document = require('./Document');
const ProvComp = require('./EComponents').ProvComponent;
const ProvAttr = require('./EComponents').ProvAttributes;
const AgentType = require('./EComponents').AgentType;
const EntityRole = require('./EComponents').EntityRole;
const JSONUtils = require('../services/JSONUtils');

const prepareDocument = Symbol('prepareDocument');
const parseActivities = Symbol('parseActivities');
const parseAgents = Symbol('parseAgents');
const parseEntities = Symbol('parseEntities');
const parseUsage = Symbol('parseUsage');
const parseGeneration = Symbol('parseGeneration');

class JSONParser extends AParser{

    static parse(rawDocument) {
        let parsedDoc = new Document();
        let rawDocObj = JSON.parse(rawDocument);

        let rawDocMap = this[prepareDocument](rawDocObj); //convert list of objects to more usable map format

        this[parseActivities](rawDocMap.get(ProvComp.ACTIVITY), parsedDoc);
        this[parseAgents](rawDocMap.get(ProvComp.AGENT), parsedDoc);
        this[parseEntities](rawDocMap.get(ProvComp.ENTITY), parsedDoc);
        this[parseUsage](rawDocMap.get(ProvComp.USAGE), parsedDoc);
        this[parseGeneration](rawDocMap.get(ProvComp.GENERATION), parsedDoc);

        return parsedDoc;
    }

    static [prepareDocument](rawDocObj) {
        const rawDocMap = new Map();
        Object.keys(rawDocObj).forEach(key => {
            rawDocMap.set(key, rawDocObj[key]);
        });
        return rawDocMap;
    }

    static [parseActivities](rawObj, doc) {
        for(let activityId in rawObj) {
            let activity = rawObj[activityId];
            doc.addActivity(activityId, activity[ProvAttr.START_TIME], activity[ProvAttr.END_TIME]);
        }
    }

    static [parseAgents](rawObj, doc) {
        for(let agentId in rawObj) {
            let agent = rawObj[agentId];
            if(agent[ProvAttr.TYPE] == AgentType.PERSON || agent[ProvAttr.TYPE] == AgentType.SOFTWARE_AGENT) {
                let type = agent[ProvAttr.TYPE] == AgentType.PERSON ? AgentType.PERSON : AgentType.SOFTWARE_AGENT;
                let deviceKey = JSONUtils.findKeyInObj('device', agent);
                doc.addAgent(agentId, type, agent.label, agent[deviceKey]);
            } else throw new Error('Invalid agent type detected, only prov:SoftwareAgent or prov:Person are allowed');
          
        }
    }

    static [parseEntities](rawObj, doc) { //TODO: Parse Owner
        for(let inputId in rawObj) {
            let input = rawObj[inputId];
            doc.addEntity(inputId, input[ProvAttr.TYPE], null, input[ProvAttr.LABEL]);
        }
    }

    static [parseUsage](rawObj, doc) {
        for(let usageId in rawObj) {
            let usage = rawObj[usageId];
            doc.setEntityRelation(usage[ProvAttr.ENTITY], EntityRole.CREATOR, usage[ProvAttr.ACTIVITY]);
        }
    }

    static[parseGeneration](rawObj, doc) {
        for(let generationId in rawObj) {
            let generation = rawObj[generationId];
            doc.setEntityRelation(generation[ProvAttr.ENTITY], EntityRole.CREATION, generation[ProvAttr.ACTIVITY]);
        }
    }

    //TODO: Relate Agents with Activity

}

module.exports = JSONParser;
