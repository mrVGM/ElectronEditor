let openContextMenu = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Open Context Menu',
            params: {
                menus: {
                    name: 'Menus',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'custom',
                        value: {
                            elementTag: {
                                name: 'Element Tag',
                                type: 'fileObject',
                                value: undefined
                            },
                            menuPrefab: {
                                name: 'Menu Prefab',
                                type: 'fileObject',
                                value: undefined
                            }
                        }
                    }
                }
            },
            interface: {
                state: 'Enabled',
                handleEventImpl: function(inst, e) {
                    if (e.type !== 'contextmenu') {
                        return;
                    }
                    let target = e.target;
                    let appId = target.getAttribute('app_id');
                    if (!appId) {
                        return;
                    }

                    let taggedElement = document.appData.api.findRenderedElement(appId);
                    taggedElement = document.appData.api.getComponent(taggedElement.gameObject, document.appData.scripts.taggedElement);
                    
                    if (!taggedElement) {
                        return;
                    }

                    for (let i = 0; i < inst.params.menus.value.length; ++i) {
                        let cur = inst.params.menus.value[i].value;
                        if (cur.elementTag.value === taggedElement.params.elementType.value) {
                            console.log('Openning menu ', document.appData.library[cur.menuPrefab.value]);
                        }
                    }
                },
            }
        };
        return inst;
    }
};

module.exports = openContextMenu;