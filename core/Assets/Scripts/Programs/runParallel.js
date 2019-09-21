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
                    let childPrograms = [].concat(inst.gameObject.children);
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
                        let singleProgramTag = document.appData.appSettings.params.programsSettings.value.singleProgramTag.value;
                        if (inst.interface.events[singleProgramTag]) {
                            let programInSingleMode = inst.interface.events[singleProgramTag][0];
                            for (let i = 0; i < childPrograms.length; ++i) {
                                if (childPrograms[i].gameObject.id !== programInSingleMode.gameObject.id) {
                                    childPrograms[i].interface.stopProgram(childPrograms[i]);
                                }
                            }
                        }
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