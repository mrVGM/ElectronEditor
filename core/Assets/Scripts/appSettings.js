let appSettings = {
    onLoad: function() {
        document.appData.scripts.appSettings = appSettings;
    },
    createInstance: function() {
        let inst = {
            name: 'App Settings',
            params: {
                initialPrefab: {
                    name: 'Initial Prefab',
                    type: 'fileObject',
                    value: undefined
                },
                userInteractionPrefab: {
                    name: 'User Interaction Prefab',
                    type: 'fileObject',
                    value: undefined,
                }
            }
        };
        return inst;
    }
};

module.exports = appSettings;