let hierarchy = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Hierarchy renderer',
            params: {
                rootGameObject: {
                    name: 'Root Game Object',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
            }
        };
        return inst;
    }
};

module.exports = hierarchy;