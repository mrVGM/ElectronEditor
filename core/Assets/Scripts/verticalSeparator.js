let verticalSeparator = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Vertical Separator renderer',
            interface: {
                upperElement: undefined,
                lowerElement: undefined
            }
        };
        return inst;
    }
};

module.exports = verticalSeparator;