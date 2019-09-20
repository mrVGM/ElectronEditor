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
                    let crt = program.interface.coroutine(program);
                    crt = crt.next();
                    if (!crt.done) {
                        document.appData.programsBrain.prioritizedCoroutines.push({ priority: program.params.priority.value, coroutine: crt });
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = startProgram;