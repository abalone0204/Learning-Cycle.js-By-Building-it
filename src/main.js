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
            .map(i => `Seconds elapsed ${i}`)
        ), 
        Log: Observable.timer(0, 2000)
            .map(i => 2 * i)
    }
    return sinks;
}

// Effects
function DOMDriver(text$) {
    text$.subscribe(text => {
        const container = document.querySelector('#app');
        container.textContent = text;
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