let runParallel = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
    createInstance: function() {
        let inst = {
            name: 'Run Parallel',
            interface: {
                anyRunning: function(childPrograms) {
                    for (let i = 0; i < childPrograms.length; ++i) {
                        if (!childPrograms[i].interface.finished) {
                            return true;
                        }
                    }
                    return false;
                },
                getChildPrograms: function(inst) {
                    let childPrograms = inst.gameObject.children;
                    for (let i = 0; i < childPrograms.length; ++i) {
                        childPrograms[i] = document.appData.api.getComponent(childPrograms[i], document.appData.scripts.programs.program);
                    }
                    return childPrograms;
                },
                main: function*(inst) {
                    let childPrograms = inst.interface.getChildPrograms(inst);
                    for (let i = 0; i < childPrograms.length; ++i) {
                        childPrograms[i].interface.startProgram(childPrograms[i], inst.interface.context);
                    }

                    while (inst.interface.anyRunning(childPrograms)) {
                        yield;
                    }
                },
                finish: function*(inst) {
                    let childPrograms = inst.interface.getChildPrograms(inst);
                    for (let i = 0; i < childPrograms.length; ++i) {
                        childPrograms[i].interface.stopProgram(childPrograms[i]);
                    }
                    while (inst.interface.anyRunning(childPrograms)) {
                        yield;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = runParallel;