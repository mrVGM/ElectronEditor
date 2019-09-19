let gameObjectReference = {
    onLoad: function() {
        document.appData.scripts.gameObjectReference = gameObjectReference;
    },
    createInstance: function() {
        let inst = {
            name: 'GameObject Reference',
            params: {
                gameObject: {
                    name: 'Game Object',
                    type: 'gameObject',
                    value: undefined
                }
            },
        };
        return inst;
    }
};

module.exports = gameObjectReference;