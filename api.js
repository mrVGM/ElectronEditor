function merge(param, base, ext) {
    let childParam = ext[param];
    if (!childParam) {
        return;
    }
    let baseParam = base[param];
    if (!baseParam) {
        return;
    }

    for (let key in childParam) {
        baseParam[key] = childParam[key];
    }
}

function instantiateScript(id) {
    let lib = document.appData.library;
    let script = lib[id].script;
    if (script.extendsFrom) {
        let baseScript = script.extendsFromId;
        if (baseScript) {
            let base = instantiateScript(baseScript);
            let child = script.createInstance();
            merge('params', base, child);
            merge('interface', base, child);
            base.name = child.name;
            return base;
        }
        let err = new Error('Base Script not found!');
        console.log(err);
    }
    return script.createInstance();
}

function copyParam(template) {
    let res = {
        name: template.name,
        type: template.type,
    };
    if (template.type === 'array') {
        res.defaultElement = copyParam(template.defaultElement);
        res.value = [];
        for (let i = 0; i < template.value.length; ++i) {
            res.value.push(copyParam(template.value[i]));
        }
        return res;
    }
    if (template.type === 'custom') {
        res.value = {};
        for (let key in template.value) {
            res.value[key] = copyParam(template.value[key]);
        }
        return res;
    }

    res.value = template.value;
    return res;
}

function syncParams(templateParams, referenceParams) {
    for (let key in referenceParams) {
        if (templateParams[key]) {
            syncParam(templateParams[key], referenceParams[key]);
        }
    }
}

function syncParam(template, referenceParam) {
    let paramType = template.type;
    if (paramType !== referenceParam.type) {
        return;
    }

    if (paramType !== 'array' && paramType !== 'custom') {
        template.value = referenceParam.value;
        return;
    }
    if (paramType === 'array') {
        if (template.defaultElement.type !== referenceParam.defaultElement.type) {
            return;
        }
        let arr = copyParam(referenceParam);
        template.value = arr.value;
        return;
    }
    if (paramType === 'custom') {
        syncParams(template.value, referenceParam.value);
        return;
    }
}

function syncScriptInstances(template, instance) {
    syncParams(template.params, instance.params);
}

function processComponent(component) {
    let instance = instantiateScript(component.script);
    syncScriptInstances(instance, component.instance);
    component.instance = instance;
}

function processGO(go, parent) {
    go.parent = parent;
    for (let i = 0; i < go.components.length; ++i) {
        processComponent(go.components[i]);
        go.components[i].instance.gameObject = go;
    }
    for (let i = 0; i < go.children.length; ++i) {
        processGO(go.children[i], go);
    }
    return go;
}

function findGO(root, id) {
    if (root.id === id) {
        return root;
    }
    for (let i = 0; i < root.children.length; ++i) {
        let res = findGO(root.children[i], id);
        if (res) {
            return res;
        }
    }
}

function linkGameObjectParam(param, root) {
    if (param.type === 'gameObject') {
        param.gameObjectRef = findGO(root, param.value);
        return;
    }
    if (param.type === 'array') {
        for (let i = 0; i < param.value.length; ++i) {
            linkGameObjectParam(param.value[i], root);
        }
        return;
    }
    if (param.type === 'custom') {
        linkGameObjectParams(params.value, root);
        return;
    }
}

function linkGameObjectParams(params, root) {
    for (let key in params) {
        linkGameObjectParam(params[key], root);
    }
}

function linkGameObjects(go, root) {
    for (let i = 0; i < go.components.length; ++i) {
        linkGameObjectParams(go.components[i].instance.params, root);
    }
    for (let i = 0; i < go.children.length; ++i) {
        linkGameObjects(go.children[i], root);
    }
}

function setUniqueIDs(go) {
    let id = document.appData.api.id;
    go.id = getID();
    for (let i = 0; i < go.children.length; ++i) {
        setUniqueIDs(go.children[i]);
    }
}

function instantiatePrefabFromString(prefabStr) {
    let json = JSON.parse(prefabStr);
    let go = processGO(json, undefined);
    linkGameObjects(go, go);
    if (!document.appData.liveObjects) {
        document.appData.liveObjects = [];
    }
    setUniqueIDs(go);
    document.appData.liveObjects.push(go);
    return go;
}

function getID() {
    let uuidv1 = require('uuid/v1');
    let res = uuidv1({ node: document.appData.mac });
    return res;
}

function extendsFrom(id1, id2) {
    if (id1 === id2) {
        return true;
    }
    let script1 = document.appData.library[id1].script;
    if (!script1.extendsFrom) {
        return false;
    }
    
    return extendsFrom(script1.extendsFromId, id2);
}

function getComponent(go, component) {
    for (let i = 0; i < go.components.length; ++i) {
        if (extendsFrom(go.components[i].script, component.id)) {
            return go.components[i].instance;
        }
    }
}

function findRenderedElement(id) {
    function find(go) {
        let renderEJS = getComponent(go, document.appData.scripts.renderEJS);
        if (renderEJS && renderEJS.interface.id === id) {
            return renderEJS;
        }
        for (let i = 0; i < go.children.length; ++i) {
            let res = find(go.children[i]);
            if (res) {
                return res;
            }
        }
    }

    for (let i = 0; i < document.appData.liveObjects.length; ++i) {
        let res = find(document.appData.liveObjects[i]);
        if (res) {
            return res;
        }
    }
}

function initAPI() {
    document.appData.api = {};
    document.appData.getID = getID,
    document.appData.api.instantiatePrefabFromString = instantiatePrefabFromString;
    document.appData.api.processComponent = processComponent;
    document.appData.api.getComponent = getComponent;
    document.appData.api.findRenderedElement = findRenderedElement;
}

module.exports = initAPI;