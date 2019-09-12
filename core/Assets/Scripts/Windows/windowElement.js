let windowElement = {
    onLoad: function() {
        document.appData.scripts.windowElement = windowElement;
    },
    createInstance: function() {
        let inst = {
            name: 'Window element',
            params: {
                window: {
                    name: 'Window',
                    type: 'gameObject',
                    value: undefined
                },
                elementType: {
                    name: 'Element type',
                    type: 'fileObject',
                    value: undefined
                }
            },
        };
        return inst;
    }
};

module.exports = windowElement;