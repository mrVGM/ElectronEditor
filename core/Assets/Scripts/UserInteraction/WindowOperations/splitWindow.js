let slpitWindow = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Split',
            params: {
                splitDirection: {
                    name: 'Split direction',
                    type: 'text',
                    value: 'Down'
                },
                splitButtonTag: {
                    name: 'Split Down Button Tag',
                    type: 'fileObject',
                    value: undefined
                }
            },
            interface: {
                state: 'Enabled',
                handleEventImpl: function(inst, e) {
                    if (e.type !== 'click') {
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

                    if (windowElement.params.elementType.value === inst.params.splitButtonTag.value) {
                        let window = windowElement.params.window.gameObjectRef;
                        window = document.appData.api.getComponent(window, document.appData.scripts.renderEJS);
                        if (inst.params.splitDirection.value === 'Down') {
                            window.interface.splitVertically(window);
                        }
                        else {
                            window.interface.splitHorizontally(window);
                        }
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = slpitWindow;