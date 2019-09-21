let changeWindowType = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
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
                main: function*(inst) {
                    while (true) {
                        let e = document.appData.programsBrain.currentEvent;
                        if (!e) {
                            yield;
                            continue;
                        }
                        if (e.type !== 'click') {
                            yield;
                            continue;
                        }
                        let target = e.target;
                        let appId = target.getAttribute('app_id');
                        if (!appId) {
                            yield;
                            continue;
                        }

                        let windowElement = document.appData.api.findRenderedElement(appId);
                        windowElement = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.windowElement);
                        
                        if (!windowElement) {
                            yield;
                            continue;
                        }

                        let windowType = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.windowType);

                        if (windowElement.params.elementType.value === inst.params.windowTypeButton.value) {
                            let window = windowElement.params.window.gameObjectRef;
                            window = document.appData.api.getComponent(window, document.appData.scripts.renderEJS);
                            window.interface.renderContent(window, windowType.params.type.value);
                        }
                        yield;
                    }
                },
            }
        };
        return inst;
    }
};

module.exports = changeWindowType;