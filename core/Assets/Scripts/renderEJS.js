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
                },
                findHTMLElement: function(inst) {
                    let queryString = '[app_id="' + inst.interface.id + '"]';
                    let res =  document.querySelector(queryString);
                    return res;
                }
            }
        };
        return inst;
    }
};

module.exports = renderEJS;