let program = {
    onLoad: function () {
        if (!document.appData.scripts.programs) {
            document.appData.scripts.programs = {};
        }
        document.appData.scripts.programs.program = program;
    },
    createInstance: function() {
        let inst = {
            name: 'Program',
            params: {
                priority: {
                    name: 'Priority',
                    type: 'number',
                    value: 0
                },
                subscribeTo: {
                    name: 'SubscribeTo',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'gameObject',
                        value: undefined
                    }
                }
            },
            interface: {
                subscribers: [],
                started: false,
                finished: false,
                stop: false,
                context: {},
                events: {},
                init: function(inst) {
                    for (let i = 0; i < inst.params.subscribeTo.value.length; ++i) {
                        let program = inst.params.subscribeTo.value[i].gameObjectRef;
                        program = document.appData.api.getComponent(program, document.appData.scripts.programs.program);
                        inst.interface.subscribers.push(program);
                    }
                },
                stopProgram: function(inst) {
                    inst.interface.stop = true;
                },
                startProgram: function(inst, context) {
                    inst.interface.started = true;
                    inst.interface.finished = false;
                    inst.interface.stop = false;
                    inst.interface.context = context;

                    let crt = inst.interface.coroutine(inst);
                    crt = crt.next();
                    if (!crt.done) {
                        document.appData.programsBrain.prioritizedCoroutines.push({ priority: program.params.priority.value, coroutine: crt });
                    }
                },
                main: function* (inst) {},
                finish: function*(inst) {},
                combined: function*(inst) {
                    let main = inst.interface.main(inst);
                    let cur = main.next();
                    while(!cur.done && !inst.interface.stop) {
                        yield;
                        cur = main.next();
                    }
                    let finish = inst.interface.finish(inst);
                    cur = finish.next();
                    while(!cur.done) {
                        yield;
                        cur = finish.next();
                    }
                    inst.finished = true;
                },
                coroutine: function*(inst) {
                    let comb = inst.interface.combined(inst);
                    let cur = comb.next();
                    inst.events = {};
                    while (!cur.done) {
                        yield;
                        cur = comb.next();
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = program;