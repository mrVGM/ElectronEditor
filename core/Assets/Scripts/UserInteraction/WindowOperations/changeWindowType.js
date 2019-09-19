let changeWindowType = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    createInstance: function() {
        let inst = {
            name: 'Change Window Type',
            params: {
                windowTypeButton: {
                    name: 'Window Type Button Tag',
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

                    let windowType = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.windowType);

                    if (windowElement.params.elementType.value === inst.params.windowTypeButton.value) {
                        let window = windowElement.params.window.gameObjectRef;
                        window = document.appData.api.getComponent(window, document.appData.scripts.renderEJS);
                        window.interface.renderContent(window, windowType.params.type.value);
                    }
                },
            }
        };
        return inst;
    }
};

module.exports = changeWindowType;