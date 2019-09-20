let slpitWindow = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
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
                main: function* (inst) {
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
                            yield
                            continue;
                        }

                        let windowElement = document.appData.api.findRenderedElement(appId);
                        windowElement = document.appData.api.getComponent(windowElement.gameObject, document.appData.scripts.windowElement);
                        
                        if (!windowElement) {
                            yield
                            continue;
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
                        yield;
                    }
                }
            }
        };
        return inst;
    }
};

module.exports = slpitWindow;