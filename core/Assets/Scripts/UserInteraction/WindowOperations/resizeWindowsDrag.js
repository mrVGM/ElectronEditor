let resizeWindowsDrag = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Resize Windows Drag',
            params: {
                splitLineTag: {
                    name: 'Split Line Tag',
                    type: 'fileObject',
                    value: undefined
                },
                contextTag: {
                    name: 'Context Tag',
                    type: 'fileObject',
                    value: undefined
                },
            },
            interface: {
                state: 'Enabled',
                handleEventImpl: function(inst, e) {
                    function absoluteCoordinates(elem, coord) {
                        if (!elem) {
                            return coord;
                        }
                        let newCoord = {x: coord.x + elem.offsetLeft, y: coord.y + elem.offsetTop};
                        return absoluteCoordinates(elem.parentElement, newCoord);
                    }

                    if (e.type !== 'mousemove' && e.type !== 'mouseup') {
                        return;
                    }
                    let pipe = inst.gameObject.parent;
                    pipe = document.appData.api.getComponent(pipe, document.appData.scripts.stateNode);
                    let context = document.appData.UIContext[inst.params.contextTag.value];
                    let groupHTML = context.group.interface.findHTMLElement(context.group);

                    let affectedElements = [].concat(context.affectedElements);

                    for (let i = 0; i < affectedElements.length; ++i) {
                        affectedElements[i] = affectedElements[i].interface.findHTMLElement(affectedElements[i]);
                    }

                    let leftTop = {x: affectedElements[0].offsetLeft, y: affectedElements[0].offsetTop};
                    let bottomRight = {
                        x: affectedElements[1].offsetLeft + affectedElements[1].offsetWidth, 
                        y: affectedElements[1].offsetTop + affectedElements[1].offsetHeight
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

                    if (context.group.params.groupType.value === 'Horizontal') {
                        let percPos = (mousePos.x - bounds.left) / (bounds.right - bounds.left);
                        let wholeElementsPerc = context.affectedElements[0].interface.width + context.affectedElements[1].interface.width;
                        context.affectedElements[0].interface.width = percPos * wholeElementsPerc;
                        context.affectedElements[1].interface.width = (1 - percPos) * wholeElementsPerc;
                    }
                    else {
                        let percPos = (mousePos.y - bounds.top) / (bounds.bottom - bounds.top);
                        let wholeElementsPerc = context.affectedElements[0].interface.height + context.affectedElements[1].interface.height;
                        context.affectedElements[0].interface.height = percPos * wholeElementsPerc;
                        context.affectedElements[1].interface.height = (1 - percPos) * wholeElementsPerc;
                    }
                    
                    context.affectedElements[0].interface.refreshSize(context.affectedElements[0]);
                    context.affectedElements[1].interface.refreshSize(context.affectedElements[1]);
                
                    context.group.interface.updateSplittingLines(context.group);

                    if (e.type === 'mouseup') {
                        inst.interface.state = 'Disabled';
                        delete document.appData.UIContext[inst.params.contextTag.value];
                        return;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = resizeWindowsDrag;