require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
import {
    button, p, label, div, makeDOMDriver
}
from '@cycle/dom';

import Rx from "rx";

function main(sources) {
    const decrementClick$ = sources.DOM
        .select('#decrement').events('click');
    const incrementClick$ = sources.DOM
        .select('#increment').events('click');
    const decrementAction$ = decrementClick$.map(ev => -1);
    const incrementAction$ = incrementClick$.map(ev => 1);
    const number$ = Rx.Observable.of(0)
        .merge(decrementAction$)
        .merge(incrementAction$)
        .scan((prev, cur) => prev+cur);
    return {
        DOM: number$.map(number =>
            div([
                button('#decrement', 'Decrement'),
                button('#increment', 'Increment'),
                p([
                    label(String(number))
                ])
            ])
        )
    }
}

const drivers = {
    DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers);