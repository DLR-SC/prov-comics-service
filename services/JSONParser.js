const AParser = require('../model/AParser');
const Document = require('../model/Document');
const ProvComp = require('../model/EComponents').ProvComponent;
const ProvAttr = require('../model/EComponents').ProvAttributes;
const AgentType = require('../model/EComponents').AgentType;
const EntityRole = require('../model/EComponents').EntityRole;
const JSONUtils = require('./JSONUtils');

//Static private methods
const prepareDocument = Symbol('prepareDocument');
const parseActivities = Symbol('parseActivities');
const parseAgents = Symbol('parseAgents');
const parseEntities = Symbol('parseEntities');
const parseUsage = Symbol('parseUsage');
const parseGeneration = Symbol('parseGeneration');
const parseAssociation = Symbol('parseAssociation');
const parseAttribution = Symbol('parseAttribution');

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
        this[parseAssociation](rawDocMap.get(ProvComp.ASSOCIATION), parsedDoc);
        this[parseAttribution](rawDocMap.get(ProvComp.ATTRIBUTION), parsedDoc);

        parsedDoc = this.sortDocumentByDate(parsedDoc);

        return parsedDoc;
    }

    static [prepareDocument](rawDocObj) {
        //Resolve all qualified names
        JSONUtils.resolveQualifiedNames(rawDocObj, null, null);

        //Create Map Object for easy access
        const rawDocMap = new Map();
        Object.keys(rawDocObj).forEach(key => {
            rawDocMap.set(key, rawDocObj[key]);
        });
        return rawDocMap;
    }

    static [parseActivities](rawObj, doc) {
        for(let activityId in rawObj) {
            let activity = rawObj[activityId];
            doc.addActivity(activityId, activity[ProvAttr.START_TIME], activity[ProvAttr.END_TIME], activity[ProvAttr.TYPE], activity[ProvAttr.LABEL]);
        }
    }

    static [parseAgents](rawObj, doc) {
        for(let agentId in rawObj) {
            let agent = rawObj[agentId];
            if(agent[ProvAttr.TYPE] === AgentType.PERSON || agent[ProvAttr.TYPE] === AgentType.SOFTWARE_AGENT || agent[ProvAttr.TYPE] === AgentType.ORGANIZATION) {
                let type = agent[ProvAttr.TYPE];
                let deviceKey = JSONUtils.findKeyInObj('device', agent);
                doc.addAgent(agentId, type, agent[ProvAttr.LABEL], agent[deviceKey]);
            } else throw new Error('Invalid agent type detected, only prov:SoftwareAgent or prov:Person are allowed');
          
        }
    }

    static [parseEntities](rawObj, doc) {
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

    static[parseAssociation](rawObj, doc) {
        for(let associationId in rawObj) {
            let association = rawObj[associationId];
            doc.setAgentRelation(association[ProvAttr.AGENT], association[ProvAttr.ACTIVITY], association[ProvAttr.ROLE]);
        }
    }

    static[parseAttribution](rawObj, doc) {
        for(let attributionId in rawObj) {
            let attribution = rawObj[attributionId];
            doc.setAgentEntityRelation(attribution[ProvAttr.AGENT], attribution[ProvAttr.ENTITY]);
        }
    }

    static sortDocumentByDate(parsedDoc) {
        parsedDoc.activities.sort( (act1, act2) => {
            return (act1.startTime > act2.startTime) - (act1.startTime < act2.startTime);
        });
        return parsedDoc;
    }
}

module.exports = JSONParser;
