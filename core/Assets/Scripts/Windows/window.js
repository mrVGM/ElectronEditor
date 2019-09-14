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
                splitHorizontally: function(inst) {
                    console.log('Splitting horizontally');
                    curWindow = inst.interface.findHTMLElement(inst);
                    if (!inst.interface.group || inst.interface.group.params.groupType.value !== 'Horizontal') {
                        let horizontalGroupPrefab = document.appData.library[inst.params.horizontalGroup.value].prefabStr;
                        horizontalGroupPrefab = document.appData.api.instantiatePrefabFromString(horizontalGroupPrefab);
                        let horizontalGroup = document.appData.api.getComponent(horizontalGroupPrefab, document.appData.scripts.renderEJS);
                        curWindow.parentElement.innerHTML = horizontalGroup.interface.render(horizontalGroup);
                        horizontalGroup.interface.addElement(horizontalGroup, 0, inst);
                        horizontalGroup.interface.addElement(horizontalGroup, 0);
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
                splitVertically: function(inst) {
                    console.log('Splitting vertically');
                }
            }
        };
        return inst;
    }
};

module.exports = window;