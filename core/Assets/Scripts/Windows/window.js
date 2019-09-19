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
                getElement: function(inst) {
                    let cur = inst.gameObject;
                    while(true) {
                        cur = cur.parent;
                        if (!cur) {
                            break;
                        }
                        let renderEJS = document.appData.api.getComponent(cur, document.appData.scripts.renderEJS);
                        if (!renderEJS) {
                            continue;
                        }
                        if (renderEJS.interface.isGroupElement) {
                            return renderEJS;
                        }
                    }
                },
                getGroup: function(inst) {
                    let element = inst.interface.getElement(inst);
                    if (!element) {
                        return;
                    }
                    let group = element.gameObject.parent;
                    group = document.appData.api.getComponent(group, document.appData.scripts.renderEJS);
                    return group;
                },
                group: undefined,
                split: function(inst, splitType) {
                    curWindow = inst.interface.findHTMLElement(inst);
                    let group = inst.interface.getGroup(inst);
                    if (!group || group.params.groupType.value !== splitType) {
                        let prefabID = inst.params.horizontalGroup.value;
                        if (splitType === 'Vertical') {
                            prefabID = inst.params.verticalGroup.value;
                        }
                        let groupPrefab = document.appData.library[prefabID].prefabStr;
                        groupPrefab = document.appData.api.instantiatePrefabFromString(groupPrefab);
                        groupPrefab.parent = inst.interface.getElement(inst);
                        if (groupPrefab.parent) {
                            groupPrefab.parent = groupPrefab.parent.gameObject;
                            groupPrefab.parent.children = [groupPrefab];
                        }

                        if (inst.parent) {
                            inst.parent.children = [groupPrefab];
                        }
                        let groupComponent = document.appData.api.getComponent(groupPrefab, document.appData.scripts.renderEJS);
                        curWindow.parentElement.innerHTML = groupComponent.interface.render(groupComponent);
                        groupComponent.interface.addElement(groupComponent, 0, inst, curWindow);
                        groupComponent.interface.addElement(groupComponent, 0);
                    } 
                    else {
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
                },
                close: function(inst) {
                    if (!inst.interface.getGroup(inst)) {
                        console.log('Cannot close the initial window!');
                        return;
                    }

                    console.log('Closing');

                    let group = inst.interface.getGroup(inst);
                    let index = -1;
                    for (let i = 0; i < group.gameObject.children.length; ++i) {
                        let curElem = group.gameObject.children[i];
                        let curWindow = curElem.children[0];
                        curWindow = document.appData.api.getComponent(curWindow, document.appData.scripts.renderEJS);
                        if (curWindow.interface.id === inst.interface.id) {
                            index = i;
                            break;
                        }
                    }
                    
                    let element = group.gameObject.children[index];
                    element = document.appData.api.getComponent(element, document.appData.scripts.renderEJS);
                    
                    let elementToExpandIndex = Math.max(0, index - 1);
                    
                    let htmlElement = element.interface.findHTMLElement(element);
                    htmlElement.parentElement.removeChild(htmlElement);
                    
                    group.gameObject.children.splice(index, 1);
                    let elementToExpand = group.gameObject.children[elementToExpandIndex];
                    elementToExpand = document.appData.api.getComponent(elementToExpand, document.appData.scripts.renderEJS);
                    
                    if (group.params.groupType.value === 'Horizontal') {
                        elementToExpand.interface.width += element.interface.width;
                    } 
                    else {
                        elementToExpand.interface.height += element.interface.height;
                    }
                    elementToExpand.interface.refreshSize(elementToExpand);

                    if (group.gameObject.children.length > 1) {
                        return;
                    }

                    let win = elementToExpand.gameObject.children[0];
                    win = document.appData.api.getComponent(win, document.appData.scripts.renderEJS);
                    let winHTML = win.interface.findHTMLElement(win);
                    let groupHTMLElement = group.interface.findHTMLElement(group);
                    
                    if (!group.interface.getElement(group)) {
                        let groupParentElement = groupHTMLElement.parentElement;
                        groupParentElement.removeChild(groupHTMLElement);
                        groupParentElement.appendChild(winHTML);

                        let liveObjects = document.appData.liveObjects;
                        for (let i = 0; i < liveObjects.length; ++i) {
                            if (liveObjects[i].id === group.gameObject.id) {
                                liveObjects.splice(i, 1);
                                break;
                            }
                        }

                        win.gameObject.parent = undefined;
                        liveObjects.push(win.gameObject);
                        return;
                    }

                    let elementOfTheGroup = group.interface.getElement(group);

                    elementOfTheGroup.gameObject.children = [win.gameObject];
                    win.gameObject.parent = elementOfTheGroup.gameObject;

                    let elementOfTheGroupHTML = elementOfTheGroup.interface.findHTMLElement(elementOfTheGroup);
                    elementOfTheGroupHTML.removeChild(elementOfTheGroupHTML.firstChild);
                    elementOfTheGroupHTML.appendChild(winHTML);
                },
                renderContent: function(inst, prefabID) {
                    let prefabStr = document.appData.library[prefabID].prefabStr;
                    let prefab = document.appData.api.instantiatePrefabFromString(prefabStr);
                    let contentArea = inst.params.contentArea.gameObjectRef;
                    let contentAreaRenderEJS = document.appData.api.getComponent(contentArea, document.appData.scripts.renderEJS);
                    let contentAreaHTML = contentAreaRenderEJS.interface.findHTMLElement(contentAreaRenderEJS);
                    while (contentAreaHTML.firstChild) {
                        contentAreaHTML.removeChild(contentAreaHTML.firstChild);
                    }
                    contentArea.children = [prefab];
                    prefab.parent = contentArea;
                    let prefabRenderEJS = document.appData.api.getComponent(prefab, document.appData.scripts.renderEJS);
                    let contentElement = prefabRenderEJS.interface.renderToElement(prefabRenderEJS);
                    contentAreaHTML.appendChild(contentElement);
                }
            }
        };
        return inst;
    }
};

module.exports = window;