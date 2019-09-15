let resizeWindowsStart = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Resize Windows Start',
            params: {
                splitLineTag: {
                    name: 'Split Line Tag',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                state: 'Enabled',
                handleEventImpl: function(inst, e) {
                    if (e.type !== 'mousedown') {
                        return;
                    }
                    let target = e.target;
                    let appId = target.getAttribute('app_id');
                    if (!appId) {
                        return;
                    }

                    let windowElement = document.appData.api.findRenderedElement(appId);
                    windowElement = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.windowElement);
                    
                    if (!windowElement) {
                        return;
                    }

                    if (windowElement.params.elementType.value === inst.params.splitLineTag.value) {
                        let splitLine = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.renderEJS);
                        console.log(splitLine.interface.getAffectedElements(splitLine));
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = resizeWindowsStart;