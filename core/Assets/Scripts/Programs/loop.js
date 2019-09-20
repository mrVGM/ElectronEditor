let loop = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
    createInstance: function() {
        let inst = {
            name: 'Loop',
            interface: {
                getChildProgram: function(inst) {
                    let childProgram = inst.gameObject.children[0];
                    childProgram = document.appData.api.getComponent(childProgram, document.appData.scripts.programs.program);
                    return childProgram;
                },
                main: function*(inst) {
                    let childProgram = inst.interface.getChildProgram(inst);
                    while (true) {
                        childProgram.interface.startProgram(childProgram, inst.interface.context);
                        let run = false;
                        while(!childProgram.interface.finished) {
                            run = true;
                            yield;
                        }
                        if (!run) {
                            yield;
                        }
                    }
                },
                finish: function*(inst) {
                    let childProgram = inst.interface.getChildProgram(inst);
                    childProgram.interface.stopProgram(childPrograms);
                    
                    while (!childProgram.interface.finished) {
                        yield;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = loop;