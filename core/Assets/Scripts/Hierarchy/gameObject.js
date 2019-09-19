let gameObject = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'GameObject renderer',
            params: {
                icon: {
                    name: 'Icon',
                    type: 'gameObject',
                    value: undefined
                },
                name: {
                    name: 'Name',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
                refreshLabel: function(inst) {
                    let icon = inst.params.icon.gameObjectRef;
                    icon = document.appData.api.getComponent(icon, document.appData.scripts.renderEJS);
                    let name = inst.params.name.gameObjectRef;
                    name = document.appData.api.getComponent(name, document.appData.scripts.renderEJS);

                    let iconHTML = icon.interface.findHTMLElement(icon);
                    let nameHTML = name.interface.findHTMLElement(name);

                    let iconParent = iconHTML.parentElement;
                    let nameParent = nameHTML.parentElement;

                    iconParent.innerHTML = icon.interface.render(icon);
                    nameParent.innerHTML = name.interface.render(name);
                }
            }
        };
        return inst;
    }
};

module.exports = gameObject;