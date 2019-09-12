function initApp(callback) {
    document.appData.appRoot = document.getElementById('app_root');
    let getmac = require('getmac');
    getmac.getMac(function(err, macAddress){
        if (err)  throw err
        let mac = macAddress.split('-');
        for (let i = 0; i < mac.length; ++i) {
            mac[i] = parseInt('0x' + mac[i]);
        }
        document.appData.mac = mac;
        callback();
    });
}

module.exports = initApp;