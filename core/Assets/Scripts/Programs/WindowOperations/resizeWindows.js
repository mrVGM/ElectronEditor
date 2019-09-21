let resizeWindowsDrag = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
    createInstance: function() {
        let inst = {
            name: 'Resize Windows Drag',
            params: {
                splitLineTag: {
                    name: 'Split Line Tag',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                splitLine: undefined,
                main: function* (inst) {
                    let e = undefined;
                    let target = undefined;
                    let windowElement = undefined;
                    
                    while (true) {
                        e = document.appData.programsBrain.currentEvent;
                        if (!e) {
                            yield;
                            continue;
                        }

                        if (e.type !== 'mousedown') {
                            yield;
                            continue;
                        }

                        target = e.target;
                        let appId = target.getAttribute('app_id');
                        if (!appId) {
                            yield;
                            continue;
                        }

                        windowElement = document.appData.api.findRenderedElement(appId);
                        windowElement = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.windowElement);
                        
                        if (!windowElement) {
                            yield;
                            continue;
                        }

                        if (windowElement.params.elementType.value === inst.params.splitLineTag.value) {
                            inst.interface.splitLine = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.renderEJS);
                            break;
                        }

                        yield;
                    }

                    let singleProgramTag = document.appData.appSettings.params.programsSettings.value.singleProgramTag.value;
                    inst.interface.dispatchEvent(inst, singleProgramTag, inst);
                },

                finish: function*(inst) {
                    function absoluteCoordinates(elem, coord) {
                        if (!elem) {
                            return coord;
                        }
                        let newCoord = {x: coord.x + elem.offsetLeft, y: coord.y + elem.offsetTop};
                        return absoluteCoordinates(elem.parentElement, newCoord);
                    }

                    let splitLine = inst.interface.splitLine;
                    let affectedElements = splitLine.interface.getAffectedElements(splitLine);
                    let group = splitLine.interface.getGroup(splitLine);
                    let groupHTML = group.interface.findHTMLElement(group);

                    while (true) {
                        e = document.appData.programsBrain.currentEvent;
                        if (!e) {
                            yield;
                            continue;
                        }
                        if (e.type !== 'mousemove' && e.type !== 'mouseup') {
                            yield;
                            continue;
                        }
                        
                        let affectedElementsHTML = [].concat(affectedElements);
                        for (let i = 0; i < affectedElementsHTML.length; ++i) {
                            affectedElementsHTML[i] = affectedElementsHTML[i].interface.findHTMLElement(affectedElementsHTML[i]);
                        }

                        let leftTop = {x: affectedElementsHTML[0].offsetLeft, y: affectedElementsHTML[0].offsetTop};
                        let bottomRight = {
                            x: affectedElementsHTML[1].offsetLeft + affectedElementsHTML[1].offsetWidth, 
                            y: affectedElementsHTML[1].offsetTop + affectedElementsHTML[1].offsetHeight
                        };

                        leftTop = absoluteCoordinates(groupHTML, leftTop);
                        bottomRight = absoluteCoordinates(groupHTML, bottomRight);
                        
                        let bounds = {
                            left: leftTop.x,
                            right: bottomRight.x,
                            top: leftTop.y,
                            bottom: bottomRight.y,
                            clamp: function(pos) {
                                function clamp(a,b,c) {
                                    let res = Math.max(a, b);
                                    return Math.min(res, c);
                                }
                                return {x: clamp(pos.x, bounds.left, bounds.right), y: clamp(pos.y, bounds.top, bounds.bottom)};
                            }
                        }

                        let mousePos = absoluteCoordinates(e.target, {x: e.offsetX, y: e.offsetY});
                        mousePos = bounds.clamp(mousePos);

                        if (group.params.groupType.value === 'Horizontal') {
                            let percPos = (mousePos.x - bounds.left) / (bounds.right - bounds.left);
                            let wholeElementsPerc = affectedElements[0].interface.width + affectedElements[1].interface.width;
                            affectedElements[0].interface.width = percPos * wholeElementsPerc;
                            affectedElements[1].interface.width = (1 - percPos) * wholeElementsPerc;
                        }
                        else {
                            let percPos = (mousePos.y - bounds.top) / (bounds.bottom - bounds.top);
                            let wholeElementsPerc = affectedElements[0].interface.height + affectedElements[1].interface.height;
                            affectedElements[0].interface.height = percPos * wholeElementsPerc;
                            affectedElements[1].interface.height = (1 - percPos) * wholeElementsPerc;
                        }
                        
                        affectedElements[0].interface.refreshSize(affectedElements[0]);
                        affectedElements[1].interface.refreshSize(affectedElements[1]);
                    
                        group.interface.updateSplittingLines(group);

                        if (e.type === 'mouseup') {
                            break;
                        }
                        yield;
                    }
                    inst.interface.splitLine = undefined;                    
                }
            }
        };
        return inst;
    }
};

module.exports = resizeWindowsDrag;