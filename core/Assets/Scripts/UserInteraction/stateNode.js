let stateNode = {
    onLoad: function() {
        document.appData.scripts.stateNode = stateNode;
    },
    createInstance: function() {
        let inst = {
            name: 'State Node',
            params: {
                priority: {
                    name: 'Priority',
                    type: 'number',
                    value: 0
                }
            },
            interface: {
                state: 'Enabled',
                handleEvent: function(inst, e) {
                    if (inst.interface.state === 'Disabled') {
                        return;
                    }
                    inst.interface.handleEventImpl(inst, e);
                },
                handleEventImpl: function(inst, e) {
                    console.log('Processing: ', e);
                },
                refresh: function(inst) {
                    return true;
                }
            }
        };
        return inst;
    }
};

module.exports = stateNode;