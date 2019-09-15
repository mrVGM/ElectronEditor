let splittingLine = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Splitting Line',
            interface: {
                group: undefined,
                getGroup: function(inst) {
                    return inst.interface.group;
                },
                getAffectedElements: function(inst) {
                    return [];
                }
            }
        };
        return inst;
    }
};

module.exports = splittingLine;