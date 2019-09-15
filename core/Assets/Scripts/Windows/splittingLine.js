let splittingLine = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Splitting Line',
            interface: {
                group: undefined,
                getGroup: function(inst) {
                    return inst.interface.group;
                },
                getAffectedElements: function(inst) {
                    let group = inst.interface.getGroup(inst);
                    let linesInGroup = group.interface.splittingLines;
                    let lineIndex = -1;
                    for (let i = 0; i < linesInGroup.length; ++i) {
                        let cur = linesInGroup[i];
                        if (cur.interface.id === inst.interface.id) {
                            lineIndex = i;
                            break;
                        }
                    }

                    let element1 = group.gameObject.children[lineIndex];
                    let element2 = group.gameObject.children[lineIndex + 1];

                    element1 = document.appData.api.getComponent(element1, document.appData.scripts.renderEJS);
                    element2 = document.appData.api.getComponent(element2, document.appData.scripts.renderEJS);

                    return [element1, element2];
                }
            }
        };
        return inst;
    }
};

module.exports = splittingLine;