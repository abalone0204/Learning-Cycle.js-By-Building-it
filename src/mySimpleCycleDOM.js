import {Observable} from 'rx';
function h(tagName, children) {
    return {
        tagName,
        children
    }
}

function h1(children) {
    return h('H1', children);
}

function span(children) {
    return h('SPAN', children);
}

function createElement(obj) {
    const element = document.createElement(obj.tagName);
    obj.children
        .filter(c => typeof c === 'object')
        .map(createElement)
        .forEach(c => element.appendChild(c));
    obj.children
        .filter(c => typeof c === 'string')
        .forEach(c => element.innerHTML += c);
    return element;
}

function makeDOMDriver(mountSelector) {
    return (obj$) => {
        obj$.subscribe(obj => {
            const container = document.querySelector(mountSelector);
            const element = createElement(obj)
            container.innerHTML = '';
            container.appendChild(element);
        })
        const DOMSource = {
            selectEvents: function(tagName, eventType) {
                return Observable.fromEvent(document, eventType)
                    .filter(e => e.target.tagName === tagName.toUpperCase());
            }
        };
        return DOMSource
    }
}


const mySimpleCycleDOM = {
    h,
    h1,
    span,
    makeDOMDriver
}

export default mySimpleCycleDOM;