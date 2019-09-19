let windowType = {
    onLoad: function() {
        document.appData.scripts.windowType = windowType;
    },
    createInstance: function() {
        let inst = {
            name: 'Window type',
            params: {
                type: {
                    name: 'Window type',
                    type: 'fileObject',
                    value: undefined
                },
            },
        };
        return inst;
    }
};

module.exports = windowType;