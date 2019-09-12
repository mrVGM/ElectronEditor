let groupElement = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Group Element renderer',
            interface: {
                group: undefined,
                width: undefined,
                height: undefined,
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