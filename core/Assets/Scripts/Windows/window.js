let window = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Window renderer',
            params: {
                horizontalGroup: {
                    name: 'Horizontal Group',
                    type: 'fileObject',
                    value: undefined
                },
                verticalGroup: {
                    name: 'Vertical Group',
                    type: 'fileObject',
                    value: undefined
                },
                closeButton: {
                    name: 'Close Button',
                    type: 'gameObject',
                    value: undefined
                },
                downSplitArrow: {
                    name: 'Down Split Arrow',
                    type: 'gameObject',
                    value: undefined 
                },
                rightSplitArrow: {
                    name: 'Right Split Arrow',
                    type: 'gameObject',
                    value: undefined
                },
                windowTypes: {
                    name: 'Window Types',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'gameObject',
                        value: undefined
                    }
                },
                contentArea: {
                    name: 'Content Area',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
                group: undefined,
                split: function(inst, splitType) {
                    curWindow = inst.interface.findHTMLElement(inst);
                    if (!inst.interface.group || inst.interface.group.params.groupType.value !== splitType) {
                        let prefabID = inst.params.horizontalGroup.value;
                        if (splitType === 'Vertical') {
                            prefabID = inst.params.verticalGroup.value;
                        }
                        let groupPrefab = document.appData.library[prefabID].prefabStr;
                        groupPrefab = document.appData.api.instantiatePrefabFromString(groupPrefab);
                        let groupComponent = document.appData.api.getComponent(groupPrefab, document.appData.scripts.renderEJS);
                        curWindow.parentElement.innerHTML = groupComponent.interface.render(groupComponent);
                        groupComponent.interface.addElement(groupComponent, 0, inst);
                        groupComponent.interface.addElement(groupComponent, 0);
                    } 
                    else {
                        let group = inst.interface.group;
                        let index = -1;
                        for (let i = 0; i < group.gameObject.children.length; ++i) {
                            let elem = group.gameObject.children[i];
                            let win = elem.children[0];
                            win = document.appData.api.getComponent(win, document.appData.scripts.renderEJS);
                            if (win.interface.id === inst.interface.id) {
                                index = i;
                                break;
                            }
                        }
                        group.interface.addElement(group, index);
                    }
                },
                splitHorizontally: function(inst) {
                    console.log('Splitting horizontally');
                    inst.interface.split(inst, 'Horizontal');
                },
                splitVertically: function(inst) {
                    console.log('Splitting vertically');
                    inst.interface.split(inst, 'Vertical');
                }
            }
        };
        return inst;
    }
};

module.exports = window;