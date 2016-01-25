require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
// import {h, h1, span, makeDOMDriver} from './mySimpleCycleDOM.js';
import {h, h1, span, makeDOMDriver} from '@cycle/dom';
// import {run} from './mySimpleCycle.js';

import {
    Observable, Subject
}
from "rx";

// Logics
function main(sources) {
    const click$ = sources.DOM.select('span').events('click');
    const mouseover$ = sources.DOM.select('span').events('mouseover');
    const sinks = {
        DOM: mouseover$
            .startWith(null)
            .flatMapLatest(() =>
                Observable.timer(0, 1000)
                .map(i =>
                    h1([
                        span([
                            `Seconds elapsed ${i}`
                        ])
                    ]))
            ),
        Log: Observable.timer(0, 2000)
            .map(i => 2 * i)
    }
    return sinks;
}

// Effects


function consoleLogDriver(msg$) {
    msg$.subscribe(msg => console.log(msg));
}



const drivers = {
    DOM: makeDOMDriver('#app'),
    Log: consoleLogDriver,
}

Cycle.run(main, drivers);