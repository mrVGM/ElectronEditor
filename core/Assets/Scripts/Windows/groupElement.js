let groupElement = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Group Element renderer',
            interface: {
                isGroupElement: true,
                group: undefined,
                width: undefined,
                height: undefined,
                getGroup: function(inst) {
                    let group = inst.gameObject.parent;
                    group = document.appData.api.getComponent(group, document.appData.scripts.renderEJS);
                    return group;
                },
                refreshSize(inst) {
                    let htmlElement = inst.interface.findHTMLElement(inst);
                    htmlElement.style.width = inst.interface.width + '%';
                    htmlElement.style.height = inst.interface.height + '%';
                }
            }
        };
        return inst;
    }
};

module.exports = groupElement;