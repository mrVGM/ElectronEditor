let window = {
    extendsFrom: 'Assets\\Scripts\\renderEJS.js',
    createInstance: function() {
        let inst = {
            name: 'Window renderer',
            params: {
                closeButton: {
                    name: 'Close Button',
                    type: 'gameObject',
                    value: undefined
                },
                downSplitArrow: {
                    name: 'Down Split Arrow',
                    type: 'gameObject',
                    value: undefined 
                },
                rightSplitArrow: {
                    name: 'Right Split Arrow',
                    type: 'gameObject',
                    value: undefined
                },
                windowTypes: {
                    name: 'Window Types',
                    type: 'array',
                    value: [],
                    defaultElement: {
                        type: 'gameObject',
                        value: undefined
                    }
                },
                contentArea: {
                    name: 'Content Area',
                    type: 'gameObject',
                    value: undefined
                }
            },
            interface: {
                group: undefined,
                splitHorizontally: function(inst) {
                    console.log('Splitting horizontally')
                },
                splitVertically: function(inst) {
                    console.log('Splitting vertically');
                }
            }
        };
        return inst;
    }
};

module.exports = window;