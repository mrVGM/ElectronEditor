let horizontalSeparator = {
    onLoad: function() {
        document.appData.scripts.horizontalSeparator = horizontalSeparator;
    },
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Horizontal Separator renderer',
            interface: {
                leftElement: undefined,
                rightElement: undefined
            }
        };
        return inst;
    }
};

module.exports = horizontalSeparator;