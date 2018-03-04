export function createElem(elemName, tag) {
    const elem = document.createElement(tag || 'div');
    elem.className = 'qchart__' + elemName;

    return elem;
}

function setStyleForElem(dom, propertyName, propertyValue) {
    if (typeof propertyValue === 'number') {
        propertyValue += 'px';
    }

    dom.style[propertyName] = propertyValue;
}

export function setStyle(dom, propertyName, propertyValue) {
    if (typeof propertyName === 'object') {
        Object.keys(propertyName).forEach(function(key) {
            setStyleForElem(dom, key, propertyName[key]);
        });
    } else {
        setStyleForElem(dom, propertyName, propertyValue);
    }
}
