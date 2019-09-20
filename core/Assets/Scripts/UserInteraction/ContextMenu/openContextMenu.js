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
                },
                uiContextTag: {
                    name: 'UI Context Tag',
                    type: 'fileObject',
                    value: undefined
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
                            let contextMenuPrefabStr = document.appData.library[cur.menuPrefab.value].prefabStr;
                            let menu = document.appData.api.instantiatePrefabFromString(contextMenuPrefabStr);
                            menu = document.appData.api.getComponent(menu, document.appData.scripts.renderEJS);
                            let menuHTML = menu.interface.renderToElement(menu);

                            
                            target.appendChild(menuHTML);
                            
                            menuHTML.style.left = e.offsetX + 'px';
                            menuHTML.style.top = e.offsetY + 'px';
                            
                            document.appData.UIContext[inst.params.uiContextTag.value] = {
                                sourceElement: taggedElement,
                                sourceHTML: target,
                                menu: menu,
                                menuHTML: menuHTML,
                            };
                        }
                    }
                    inst.interface.state = 'Disabled';
                },
            }
        };
        return inst;
    }
};

module.exports = openContextMenu;