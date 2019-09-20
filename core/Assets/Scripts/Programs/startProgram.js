let startProgram = {
    createInstance: function() {
        let inst = {
            name: 'Start Program',
            params: {
                program: {
                    name: 'Program',
                    type: 'gameObject',
                    value: undefined,
                },
            },
            interface: {
                init: function(inst) {
                    let program = inst.params.program.gameObjectRef;
                    program = document.appData.api.getComponent(program, document.appData.scripts.programs.program);
                    program.interface.startProgram(program, {});
                }
            }
        };
        return inst;
    }
};

module.exports = startProgram;