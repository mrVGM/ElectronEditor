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
                    let elementPrefab = document.appData.api.library[inst.params.groupElementPrefab.value].prefabStr;
                    let windowPrefab = document.appData.api.library[inst.params.windowPrefab.value].prefabStr;
                    let element = document.appData.api.instantiatePrefabFromString(elementPrefab);
                    let window = document.appData.api.instantiatePrefabFromString(windowPrefab);
                    element.children.push(window);
                    window.parent = element;

                    let groupElement = document.appData.api.getComponent(element, document.appData.renderEJS);
                    element.interface.group = inst;

                    let cur = inst.gameObject.children[index];
                    cur = document.appData.api.getComponent(cur, document.appData.scripts.renderEJS);
                    let existing = document.querySelector('[app_id="' + cur.interface.id + '"]');

                }
            }
        };
        return inst;
    }
};

module.exports = windowGroup;