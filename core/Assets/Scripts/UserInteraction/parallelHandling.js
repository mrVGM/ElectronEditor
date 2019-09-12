let parallelHandling = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    name: 'Parallel Handling',
    createInstance: function() {
        let inst = {
            params: {
                singleActions: {
                    name: 'Single Actions',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'gameObject',
                        value: undefined
                    }
                }
            },
            interface: {
                state: 'Enabled',
                getStateNodes: function(gos) {
                    let res = [];
                    for (let i = 0; i < gos.length; ++i) {
                        res.push(document.appData.api.getComponent(gos[i], document.appData.scripts.stateNode));
                    }
                    return res;
                },
                getSingleActions: function(inst) {
                    let singleActions = [];
                    for (let i = 0; i < inst.params.length; ++i) {
                        singleActions.push(inst.params[i].gameObject);
                    }
                    return inst.interface.getStateNodes(singleActions);
                },
                getChildrenSorted: function(inst) {
                    let children = inst.interface.getStateNodes(inst.gameObject.children);
                    for (let i = 0; i < children.length - 1; ++i) {
                        for (let j = i+1; j < children.length; ++j) {
                            if (children[j].params.priority.value < children[j].params.priority.value) {
                                let tmp = children[i];
                                children[i] = children[j];
                                children[j] = tmp;   
                            }
                        }
                    }
                    return children;
                },
                handleEventImpl: function(inst, e) {
                    let children = inst.interface.getChildrenSorted(inst);
                    for (let i = 0; i < children.length; ++i) {
                        children[i].interface.handleEvent(children[i], e);
                        inst.interface.refresh(inst);
                    }
                },
                refresh: function(inst) {
                    let singleModeProgram = undefined;
                    let singleActions = inst.interface.getSingleActions(inst);
                    for (let i = 0; i < singleActions.length; ++i) {
                        if (singleActions[i].interface.state === 'Processing') {
                            singleModeProgram = singleActions[i];
                            break;
                        }
                    }
                    if (singleModeProgram) {
                        let children = inst.interface.getStateNodes(inst.gameObject.children);
                        for (let i = 0 ; i < children.length; ++i) {
                            let cur = children[i];
                            if (cur.gameObject.id !== singleModeProgram.gameObject.id) {
                                cur.interface.state = 'Disabled';
                            }
                        }
                    } 
                    else {
                        let children = inst.interface.getStateNodes(inst.gameObject.children);
                        for (let i = 0 ; i < children.length; ++i) {
                            let cur = children[i];
                            cur.interface.state = 'Enabled';
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = parallelHandling;