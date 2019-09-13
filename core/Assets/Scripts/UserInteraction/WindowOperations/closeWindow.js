let closeWindow = {
    extendsFrom: 'Assets\\Scripts\\UserInteraction\\stateNode.js',
    name: 'Close Window',
    createInstance: function() {
        let inst = {
            params: {
                closeButtonTag: {
                    name: 'Close Button Tag',
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

                    if (windowElement.params.elementType.value === inst.params.closeButtonTag.value) {
                        console.log('Closing window', windowElement.params.window.gameObjectRef);
                    }
                },
            }
        };
        return inst;
    }
};

module.exports = closeWindow;