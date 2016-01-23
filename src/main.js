require('../static/stylesheets/style.scss');
import {
    Observable, Subject
}
from "rx";


function main(DOMSource) {
    const click$ = DOMSource;
    return {
        DOM: click$
        .startWith(null)
        .flatMapLatest(() =>
            Observable.timer(0, 1000)
            .map(i => `Seconds elapsed ${i}`)
        ), 
        Log: Observable.timer(0, 2000)
            .map(i => 2 * i)
    }
}

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

function run(mainFn, drivers) {
    const proxyDOMSource = new Subject();
    const sinks = mainFn(proxyDOMSource);
    const DOMSource = drivers.DOM(sinks.DOM);
    DOMSource.subscribe(click => proxyDOMSource.onNext(click))
        // Object.keys(drivers)
        // .forEach(key => {
        //     drivers[key](sinks[key])
        // })
}

const drivers = {
    DOM: DOMDriver,
    Log: consoleLogDriver,
}

run(main, drivers);