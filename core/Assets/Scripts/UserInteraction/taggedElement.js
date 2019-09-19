let taggedElement = {
    onLoad: function() {
        document.appData.scripts.taggedElement = taggedElement;
    },
    createInstance: function() {
        let inst = {
            name: 'Tagged element',
            params: {
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

module.exports = taggedElement;