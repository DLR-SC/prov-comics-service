const ProvComponent = {
    ACTIVITY: 'activity',
    ENTITY: 'entity',
    AGENT: 'agent',
    GENERATION: 'wasGeneratedBy',
    USAGE: 'used',
    PREFIX: 'prefix',
    DERIVATION: 'wasDerivedFrom',
    ATTRIBUTION: 'wasAttributedTo',
    ASSOCIATION: 'wasAssociatedWith',
    DELEGATION: 'actedOnBehalfOf'
};

const ProvAttributes = {
    TYPE: 'prov:type',
    LABEL: 'prov:label',
    START_TIME: 'prov:startTime',
    END_TIME: 'prov:endTime',
    ENTITY: 'prov:entity',
    ACTIVITY: 'prov:activity',
    TIME: 'prov:time'
};

const AgentType = {
    SOFTWARE_AGENT: 'prov:SoftwareAgent',
    PERSON: 'prov:Person'
};

const EntityRole = {
    UNKNOWN: 0,
    CREATOR: 1,
    CREATION: 2 
};

const EComponents = {
    ProvComponent: ProvComponent,
    ProvAttributes: ProvAttributes,
    AgentType: AgentType,
    EntityRole: EntityRole
};


module.exports = EComponents;