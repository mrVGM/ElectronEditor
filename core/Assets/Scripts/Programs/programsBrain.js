let programsBrain = {
    onLoad: function() {
        document.appData.programsBrain = programsBrain;
    },
    prioritizedCoroutines: [],
    currentEvent: undefined,
    tickAgain: false,
    tick: function() {
        programsBrain.tickImpl();
        programsBrain.currentEvent = undefined;
    },
    tickImpl: function() {
        programsBrain.tickAgain = false;
        let crts = programsBrain.prioritizedCoroutines;
        console.log(crts);
        programsBrain.prioritizedCoroutines = [];
        for (let i = 0; i < crts.length - 1; ++i) {
            for (let j = i + 1; j < crts.length; ++j) {
                if (crts[i].priority > crts[j].priority) {
                    let tmp = crts[i];
                    crts[i] = crts[j];
                    crts[j] = tmp;
                }
            }
        }
        for (let i = 0; i < crts.length; ++i) {
            let curCrt = crts[i];
            let res = curCrt.coroutine.next();
            if (!res.done) {
                programsBrain.prioritizedCoroutines.push(curCrt);
            }
        }
    },
};

module.exports = programsBrain;