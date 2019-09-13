let windowGroup = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Window Group renderer',
            params: {
                groupType: {
                    name: 'Group Type',
                    type: 'text',
                    value: 'Horizontal'
                },
                groupElementPrefab: {
                    name: 'Group Element Prefab',
                    type: 'fileObject',
                    value: undefined
                },
                windowPrefab: {
                    name: 'Window Prefab',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                addElement: function(inst, index) {
                    let elementPrefab = document.appData.library[inst.params.groupElementPrefab.value].prefabStr;
                    let windowPrefab = document.appData.library[inst.params.windowPrefab.value].prefabStr;
                    let element = document.appData.api.instantiatePrefabFromString(elementPrefab);
                    let window = document.appData.api.instantiatePrefabFromString(windowPrefab);
                    element.children.push(window);
                    window.parent = element;

                    let groupElement = document.appData.api.getComponent(element, document.appData.scripts.renderEJS);
                    groupElement.interface.group = inst;

                    element.parent = inst.gameObject;

                    if (inst.gameObject.children.length === 0) {
                        inst.gameObject.children.push(element);
                        groupElement.interface.width = 100;
                        groupElement.interface.height = 100;
                        let elem = groupElement.interface.renderToElement(groupElement);
                        let windowGroupElement = inst.interface.findHTMLElement(inst);
                        windowGroupElement.appendChild(elem);
                    }
                    else {
                        let leftElement = inst.gameObject.children[index];
                        leftElement = document.appData.api.getComponent(leftElement, document.appData.scripts.renderEJS);
                        leftElement.interface.width /= 2;

                        leftElement.interface.refreshSize(leftElement);

                        inst.gameObject.children.splice(index + 1, 0, element);
                        groupElement.interface.width = leftElement.interface.width;
                        groupElement.interface.height = 100;
                        let elem = groupElement.interface.renderToElement(groupElement);
                        let windowGroupElement = inst.interface.findHTMLElement(inst);
                        windowGroupElement.appendChild(elem);
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = windowGroup;