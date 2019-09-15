let sequentialHandling = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Sequential Handling',
            interface: {
                state: 'Enabled',
                context: {},
                getStateNodes: function(gos) {
                    let res = [];
                    for (let i = 0; i < gos.length; ++i) {
                        res.push(document.appData.api.getComponent(gos[i], document.appData.scripts.stateNode));
                    }
                    return res;
                },
                handleEventImpl: function(inst, e) {
                    let children = inst.interface.getStateNodes(inst.gameObject.children);
                    for (let i = 0; i < children.length; ++i) {
                        let cur = children[i];
                        if (cur.interface.state !== 'Disabled') {
                            children[i].interface.handleEvent(children[i], e);
                            break;
                        }
                    }
                    inst.interface.refresh(inst);
                },
                refresh: function(inst) {
                    let childNodes = inst.interface.getStateNodes(inst.gameObject.children);
                    let finished = true;
                    for (let i = 0; i < childNodes.length; ++i) {
                        if (childNodes[i].interface.state !== 'Disabled') {
                            finished = false;
                        }
                    }
                    if (finished) {
                        for (let i = 0; i < childNodes.length; ++i) {
                            childNodes[i].interface.state = 'Enabled';
                        }
                        inst.interface.state = 'Disabled';
                        inst.interface.context = {};
                        return;
                    }
                    if (childNodes[0].interface.state !== 'Enabled') {
                        inst.interface.state = 'Processing';
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = sequentialHandling;