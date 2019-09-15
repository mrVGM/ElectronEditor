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
                },
                splittingLinePrefab: {
                    name: 'Splitting Line Prefab',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                splittingLines: [],
                updateSplittingLines: function(inst) {
                    let groupHTML = inst.interface.findHTMLElement(inst);
                    for (let i = 0; i < inst.interface.splittingLines.length; ++i) {
                        let cur = inst.interface.splittingLines[i];
                        let curHTML = cur.interface.findHTMLElement(cur);
                        groupHTML.removeChild(curHTML);
                    }
                    let linesNeeded = inst.gameObject.children.length - 1;
                    inst.interface.splittingLines.slice(0, linesNeeded);

                    let linePrefabStr = inst.params.splittingLinePrefab.value;
                    linePrefabStr = document.appData.library[linePrefabStr].prefabStr;
                    for (let i = inst.interface.splittingLines.length; i < linesNeeded; ++i) {
                        let linePrefab = document.appData.api.instantiatePrefabFromString(linePrefabStr);
                        let lineComponent = document.appData.api.getComponent(linePrefab, document.appData.scripts.renderEJS);
                        inst.interface.splittingLines.push(lineComponent);
                    }

                    for (let i = 0; i < inst.interface.splittingLines.length; ++i) {
                        let cur = inst.interface.splittingLines[i];
                        cur.interface.group = inst;

                        let curHTML = cur.interface.renderToElement(cur);

                        let groupHTML = inst.interface.findHTMLElement(inst);
                        groupHTML.appendChild(curHTML);

                        let offsetPerc = 0;
                        for (let j = 0; j < i + 1; ++j) {
                            let elem = inst.gameObject.children[j];
                            elem = document.appData.api.getComponent(elem, document.appData.scripts.renderEJS);
                            let elemHTML = elem.interface.findHTMLElement(elem);
                            if (inst.params.groupType.value === 'Horizontal') {
                                offsetPerc += elemHTML.offsetWidth / groupHTML.offsetWidth;
                            }
                            else {
                                offsetPerc += elemHTML.offsetHeight / groupHTML.offsetHeight;
                            }
                        }
                        offsetPerc *= 100;

                        if (inst.params.groupType.value === 'Horizontal') {
                            let lineWidthPerc = 100 / groupHTML.offsetWidth;
                            curHTML.style.left = offsetPerc - lineWidthPerc + '%';
                            curHTML.style.top = '0%';
                        }
                        else {
                            let lineHeightPerc = 100 / groupHTML.offsetHeight;
                            curHTML.style.top = offsetPerc - lineHeightPerc + '%';
                            curHTML.style.left = '0%';
                        }
                    }
                },
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
                addElement: function(inst, index, windowElement, windowElementHTML) {
                    let elementPrefab = document.appData.library[inst.params.groupElementPrefab.value].prefabStr;
                    let element = document.appData.api.instantiatePrefabFromString(elementPrefab);
                    
                    let groupElement = document.appData.api.getComponent(element, document.appData.scripts.renderEJS);

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
                    groupElement.interface.refreshSize(groupElement);

                    let window = windowElement;
                    let windowHTML = windowElementHTML;
                    if (!window) {
                        let windowPrefab = document.appData.library[inst.params.windowPrefab.value].prefabStr;
                        window = document.appData.api.instantiatePrefabFromString(windowPrefab);
                        window = document.appData.api.getComponent(window, document.appData.scripts.renderEJS);
                        windowHTML = window.interface.renderToElement(window);
                    }
                    element.children.push(window.gameObject);
                    window.gameObject.parent = element;

                    groupElementHTML.appendChild(windowHTML);

                    inst.interface.updateSplittingLines(inst);
                }
            }
        };
        return inst;
    }
};

module.exports = windowGroup;