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
                addElement: function(inst, index, windowElement) {
                    let elementPrefab = document.appData.library[inst.params.groupElementPrefab.value].prefabStr;
                    let windowPrefab = document.appData.library[inst.params.windowPrefab.value].prefabStr;
                    let element = document.appData.api.instantiatePrefabFromString(elementPrefab);
                    let window = windowElement;
                    if (!windowElement) {
                        window = document.appData.api.instantiatePrefabFromString(windowPrefab);
                    }
                    element.children.push(window);
                    window.parent = element;

                    let groupElement = document.appData.api.getComponent(element, document.appData.scripts.renderEJS);
                    groupElement.interface.group = inst;

                    element.parent = inst.gameObject;

                    let groupElementHTML = groupElement.interface.renderToElement(groupElement);

                    if (inst.gameObject.children.length === 0) {
                        inst.gameObject.children.push(element);
                        groupElement.interface.width = 100;
                        groupElement.interface.height = 100;
                        let windowGroupElement = inst.interface.findHTMLElement(inst);
                        windowGroupElement.appendChild(groupElementHTML);
                    }
                    else {
                        let splittedElement = inst.gameObject.children[index];
                        splittedElement = document.appData.api.getComponent(splittedElement, document.appData.scripts.renderEJS);

                        if (inst.params.groupType.value === 'Horizontal') {
                            splittedElement.interface.width /= 2;
                        }
                        else if (inst.params.groupType.value === 'Vertical') {
                            splittedElement.interface.height /= 2;
                        }
                        splittedElement.interface.refreshSize(splittedElement);

                        inst.gameObject.children.splice(index + 1, 0, element);
                        groupElement.interface.width = splittedElement.interface.width;
                        groupElement.interface.height = splittedElement.interface.height;

                        let windowGroupElement = inst.interface.findHTMLElement(inst);
                        
                        if (index + 1 === inst.gameObject.children.length) {
                            windowGroupElement.appendChild(groupElementHTML);
                        }
                        else {
                            let leftElementHTML = splittedElement.interface.findHTMLElement(splittedElement);
                            windowGroupElement.insertBefore(groupElementHTML, leftElementHTML.nextSibling);
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = windowGroup;