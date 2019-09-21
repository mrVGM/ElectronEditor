let changeWindowType = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
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
                currentContextMenuTag: {
                    name: 'Current Context Menu Tag',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                main: function* (inst) {
                    let taggedElement = undefined;
                    let target = undefined;
                    let e = undefined;
                    while (true) {
                        e = document.appData.programsBrain.currentEvent;
                        if (!e) {
                            yield;
                            continue;
                        }
                        if (e.type !== 'contextmenu') {
                            yield
                            continue;
                        }
                        target = e.target;
                        let appId = target.getAttribute('app_id');
                        if (!appId) {
                            yield;
                            continue;
                        }

                        taggedElement = document.appData.api.findRenderedElement(appId);
                        taggedElement = document.appData.api.getComponent(taggedElement.gameObject, document.appData.scripts.taggedElement);
                        
                        if (taggedElement) {
                            break;
                        }
                        yield;
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
                            
                            inst.interface.context[inst.params.currentContextMenuTag.value] = {
                                sourceElement: taggedElement,
                                sourceHTML: target,
                                menu: menu,
                                menuHTML: menuHTML,
                            };
                        }
                    }
                },
            }
        };
        return inst;
    }
};

module.exports = changeWindowType;