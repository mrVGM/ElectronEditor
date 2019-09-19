let gameObject = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'GameObject renderer'
        };
        return inst;
    }
};

module.exports = gameObject;