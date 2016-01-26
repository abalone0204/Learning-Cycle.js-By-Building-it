require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
import {
    input, label, h1, h4, button, a, div, makeDOMDriver
}
from '@cycle/dom';
import {
    makeHTTPDriver
}
from '@cycle/http';

import Rx from "rx";

const API_URL = 'https://api.github.com/users/abalone0204';

function main(sources) {
    const changeWeight$ = sources.DOM.select('.weight').events('input')
        .map(ev => ev.target.value).startWith(70);
    const changeHeight$ = sources.DOM.select('.height').events('input')
        .map(ev => ev.target.value).startWith(170);
    const state$ = Rx.Observable.combineLatest(
        changeWeight$,
        changeHeight$, (weight, height) => {
            const heightM = height/100;
            const bmi = Math.round(weight / (heightM * heightM));
            return {
                bmi, weight, height
            }
        })
    return {
        DOM: state$.map(state =>
            div([
                div([
                    label(`Weight: ${state.weight}kg`),
                    input('.weight', {
                        type: 'range',
                        min: 40,
                        max: 150,
                        value: state.weight
                    })
                ]),
                div([
                    label(`Height: ${state.height}cm`),
                    input('.height', {
                        type: 'range',
                        min: 140,
                        max: 250,
                        value: state.height
                    })

                ]),
                h1(`BMI is ${state.bmi}`)
            ])
        )
    }
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);