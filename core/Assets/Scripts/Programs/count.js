let count = {
    extendsFrom: 'Assets\\Scripts\\Programs\\program.js',
    createInstance: function() {
        let inst = {
            name: 'Count',
            interface: {
                main: function*(inst) {
                    for (let i = 0; i < 10; ++i) {
                        console.log(i);
                        yield;
                    }
                },
            }
        };
        return inst;
    }
};

module.exports = count;