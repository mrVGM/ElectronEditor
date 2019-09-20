let libraryPath = __dirname + '/core/library.json';

function getFilename(fe) {
    let path = fe.path;
    path = path.split('/');
    let filename = path[path.length - 1];
    return filename;
}

function getExtension(filename) {
    let ext = filename.split('.');
    ext = ext[ext.length - 1];
    return ext;
}

function getFilesOfType(extension) {
    let res = [];
    for (let entry in document.appData.library) {
        let cur = document.appData.library[entry];
        let filename = getFilename(cur);
        let ext = getExtension(filename);
        if (ext === extension) {
            res.push(cur);
        }
    }
    return res;
}

function readEJS(callback) {
    let processed = 0;
    let anyEJS = false;
    let ejsFiles = getFilesOfType('ejs');
    for (let i = 0; i < ejsFiles.length; ++i) {
        let cur = ejsFiles[i];
        anyEJS = true;
        ++processed;
        let fs = require('fs');
        fs.readFile(__dirname + '/core/' + cur.path, function(err, data) {
            cur.ejs = data.toString();
            --processed;
            if (processed === 0) {
                callback();
            }
        });
    }
    if (!anyEJS) {
        callback();
    }
}

function readPrefabs(callback) {
    let processed = 0;
    let anyPrefab = false;
    let prefabs = getFilesOfType('prefab');
    for (let i = 0; i < prefabs.length; ++i) {
        let cur = prefabs[i];
        anyPrefab = true;
        ++processed;
        let fs = require('fs');
        fs.readFile(__dirname + '/core/' + cur.path, function(err, data) {
            cur.prefabStr = data.toString();
            --processed;
            if (processed === 0) {
                callback();
            }
        });
    }
    if (!anyPrefab) {
        callback();
    }
}

function readAssets(callback) {
    let processed = 0;
    let anyAsset = false;
    let assets = getFilesOfType('asset');
    for (let i = 0; i < assets.length; ++i) {
        let cur = assets[i];
        anyAsset = true;
        ++processed;
        let fs = require('fs');
        fs.readFile(__dirname + '/core/' + cur.path, function(err, data) {
            cur.asset = data.toString();
            cur.asset = JSON.parse(cur.asset);
            document.appData.api.processComponent(cur.asset.component);
            --processed;
            if (processed === 0) {
                callback();
            }
        });
    }
    if (!anyAsset) {
        callback();
    }
}

function readScripts(callback) {
    document.appData.scripts = {};
    for (let entry in document.appData.library) {
        let cur = document.appData.library[entry];
        let filename = getFilename(cur);
        let ext = getExtension(filename);
        if (ext === 'js') {
            cur.script = require(__dirname + '/core/' + cur.path);
            cur.script.id = cur.id;
            if (cur.script.extendsFrom) {
                for (let comp in document.appData.library) {
                    let curComp = document.appData.library[comp];
                    if (curComp.path === cur.script.extendsFrom) {
                        cur.script.extendsFromId = curComp.id;
                        break;
                    }
                }
            }
            if (cur.script.onLoad) {
                cur.script.onLoad();
            }
        }
    }
    callback();
}

function processAppSettingsAsset(appSettingsAsset) {
    let prefab = document.appData.library[appSettingsAsset.params.initialPrefab.value];
    let prefabStr = prefab.prefabStr;
    let prefabInst = document.appData.api.instantiatePrefabFromString(prefabStr);
    console.log(prefabInst);

    let renderEJS = document.appData.api.getComponent(prefabInst, document.appData.scripts.renderEJS);

    let html = renderEJS.interface.render(renderEJS);
    document.appData.appRoot.innerHTML = html;

    prefab = document.appData.library[appSettingsAsset.params.userInteractionPrefab.value];
    prefabStr = prefab.prefabStr;
    prefabInst = document.appData.api.instantiatePrefabFromString(prefabStr);
    document.appData.userInteractionLogic = prefabInst;

    function callInit(go) {
        for (let i = 0; i < go.components.length; ++i) {
            let inst = go.components[i].instance;
            if (inst.interface.init) {
                inst.interface.init(inst);
            }
        }

        for (let i = 0; i < go.children.length; ++i) {
            callInit(go.children[i]);
        }
    }

    callInit(prefabInst);
}

function getAppSettingsAsset() {
    for (let entry in document.appData.library) {
        let cur = document.appData.library[entry];
        if (!cur.asset) {
            continue;
        }
        if (cur.asset.component.script !== document.appData.scripts.appSettings.id) {
            continue;
        }
        let instance = cur.asset.component.instance;
        return instance;
    }
}

function appStarter() {
    console.log('Hello');

    let fs = require('fs');
    fs.readFile(libraryPath, function(err, data) {
        document.appData.library = data.toString();
        document.appData.library = JSON.parse(document.appData.library);
        readEJS(function() {
            console.log('EJS read');
            readScripts(function() {
                console.log('Scripts read');
                readAssets(function() {
                    console.log('Assets read');
                    readPrefabs(function() {
                        console.log('Prefabs read');
                        let initApp = require('./initApp');
                        initApp(function() {
                            let appSettingsAsset = getAppSettingsAsset();
                            processAppSettingsAsset(appSettingsAsset);
                        });
                    });
                });
            }); 
        });
    });
}

module.exports = appStarter;