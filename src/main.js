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

function intent (DOMSource) {
    const changeWeight$ = DOMSource.select('.weight').events('input')
        .map(ev => ev.target.value).startWith(70);
    const changeHeight$ = DOMSource.select('.height').events('input')
        .map(ev => ev.target.value).startWith(170);
    return {changeWeight$,changeHeight$};
}

function model(changeWeight$, changeHeight$) {
    const state$ = Rx.Observable.combineLatest(
        changeWeight$,
        changeHeight$, (weight, height) => {
            const heightM = height/100;
            const bmi = Math.round(weight / (heightM * heightM));
            return {
                bmi, weight, height
            }
        })
    return state$;
}

function view(state$) {
    const vtree$ = state$.map(state =>
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
    return vtree$;
}
function main(sources) {
    const {changeWeight$,changeHeight$} = intent(sources.DOM);
    const state$ = model(changeWeight$, changeHeight$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    }
}

const drivers = {
    DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);