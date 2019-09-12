let renderEJS = {
    onLoad: function() {
        document.appData.scripts.renderEJS = renderEJS;
    },
    createInstance: function() {
        let inst = {
            name: 'EJS renderer',
            params: {
                ejs: {
                    name: 'EJS File',
                    type: 'fileObject',
                    value: undefined
                },
            },
            interface: {
                id: undefined,
                render: function(inst) {
                    if (!inst.interface.id) {
                        inst.interface.id = document.appData.getID();
                    }
                    let ejs = require('ejs');
                    let ejsFile = document.appData.library[inst.params.ejs.value].ejs;
                    let res = ejs.render(ejsFile, { source: inst });
                    return res;
                }
            }
        };
        return inst;
    }
};

module.exports = renderEJS;