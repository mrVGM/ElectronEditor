let sequentialHandling = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Sequential Handling',
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

module.exports = sequentialHandling;