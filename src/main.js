require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
import {
    Observable, Subject
}
from "rx";


// Logics
function main(sources) {
    const click$ = sources.DOM;
    const sinks = {
        DOM: click$
        .startWith(null)
        .flatMapLatest(() =>
            Observable.timer(0, 1000)
            .map(i => {
                return {
                    tagName: "H1",
                    children: [
                    {
                        tagName: 'SPAN',
                        children: [
                        `Seconds elapsed ${i}`
                        ]
                    }
                    ]
                }
            })
        ), 
        Log: Observable.timer(0, 2000)
            .map(i => 2 * i)
    }
    return sinks;
}

// Effects

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

function DOMDriver(obj$) {
    obj$.subscribe(obj => {
        const container = document.querySelector('#app');
        const element = createElement(obj)

        container.innerHTML = '';
        container.appendChild(element);
    })
    const DOMSource = Observable.fromEvent(document, "click");
    return DOMSource
}

function consoleLogDriver(msg$) {
    msg$.subscribe(msg => console.log(msg));
}



const drivers = {
    DOM: DOMDriver,
    Log: consoleLogDriver,
}

Cycle.run(main, drivers);