let hierarchy = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Hierarchy renderer',
            params: {
                gameObjectPrefab: {
                    name: 'Root Game Object',
                    type: 'fileObject',
                    value: undefined
                },
                contextHierarchyTag: {
                    name: 'Context Tag',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                getRootGameObject: function(inst) {
                    let rootGameObject = document.appData.UIContext[inst.params.contextHierarchyTag.value];
                    if (!rootGameObject) {
                        let prefabStr = document.appData.library[inst.params.gameObjectPrefab.value].prefabStr;
                        rootGameObject = document.appData.api.instantiatePrefabFromString(prefabStr);
                        rootGameObject = document.appData.api.getComponent(rootGameObject, document.appData.scripts.renderEJS);
                        document.appData.UIContext[inst.params.contextHierarchyTag.value] = rootGameObject;
                    }
                    inst.gameObject.children = [rootGameObject.gameObject];
                    rootGameObject.gameObject.parent = inst.gameObject;
                    return rootGameObject;
                }
            }
        };
        return inst;
    }
};

module.exports = hierarchy;