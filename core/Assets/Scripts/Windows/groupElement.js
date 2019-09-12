let groupElement = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Group Element renderer',
            interface: {
                group: undefined,
                width: undefined,
                height: undefined,
            }
        };
        return inst;
    }
};

module.exports = groupElement;