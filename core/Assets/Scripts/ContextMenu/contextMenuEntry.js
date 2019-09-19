let contextMenuEntry = {
    onLoad: function() {
        document.appData.scripts.contextMenuEntry = contextMenuEntry;
    },
    createInstance: function() {
        let inst = {
            name: 'Context Menu Entry Tag',
            params: {
                entryTag: {
                    name: 'Entry Tag',
                    type: 'fileObject',
                    value: undefined
                }
            },
        };
        return inst;
    }
};

module.exports = contextMenuEntry;