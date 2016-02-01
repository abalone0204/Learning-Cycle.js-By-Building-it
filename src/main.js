require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
import isolate from '@cycle/isolate';
import {
    input, label, h1, h4, button, a, div, makeDOMDriver
}
from '@cycle/dom';
import {
    makeHTTPDriver
}
from '@cycle/http';

import Rx from "rx";

function intent(DOMSource) {
    const change$ = DOMSource.select('.slider').events('input')
        .map(ev => ev.target.value);
    return change$;
}

function model(upcomingValue$, props$) {
    const initValue$ = props$.map(props => props.init).first();
    const value$ = initValue$.concat(upcomingValue$);
    const state$ = Rx.Observable.combineLatest(value$, props$, (value, props) => {
        return {
            label: props.label,
            unit: props.unit,
            min: props.min,
            max: props.max,
            value: value
        }
    })
    return state$
}

function view(state$) {
    const vtree$ = state$.map(state =>
        div('.labled-slider', [
            label('.label', `${state.label}: ${state.value} ${state.unit}`),
            input('.slider', {
                type: 'range',
                min: state.min,
                max: state.max,
                value: state.value
            })
        ])
    )
    return vtree$;
}

function LabelSlider(sources) {
    const upcomingValue$ = intent(sources.DOM);
    const state$ = model(upcomingValue$, sources.props);
    const vtree$ = view(state$);
    return {
        DOM: vtree$,
        value: state$.map(state=> state.value)
    }
}

function main(sources) {
    const weightProps$ = Rx.Observable.of({
        label: 'Weight',
        unit: 'kg',
        min: 30,
        max: 220,
        init: 70
    })
    const WeightSlider = isolate(LabelSlider, 'weight');
    const weightSinks$ = WeightSlider({
        DOM: sources.DOM,
        props: weightProps$
    });
    const weightVtree$ = weightSinks$.DOM;
    const weightValue$ = weightSinks$.value;

    const heightProps$ = Rx.Observable.of({
        label: 'Height',
        unit: 'cm',
        min: 100,
        max: 220,
        init: 170
    });
    const HeightSlider = isolate(LabelSlider, 'height');
    const heightSinks$ = HeightSlider({
        DOM: sources.DOM,
        props: heightProps$
    });
    const heightVtree$ = heightSinks$.DOM;
    const heightValue$ = heightSinks$.value;
    const bmi$ = Rx.Observable.combineLatest(weightValue$, heightValue$, (weight, height) => {
        const heightMeters = height * 0.01;
        const bmi = Math.round(weight/(heightMeters*heightMeters))
        return bmi;
    });
    const vtree$ = Rx.Observable.combineLatest(bmi$, weightVtree$, heightVtree$, (bmi, weightVtree, heightVtree) =>
        div([
            weightVtree,
            heightVtree,
            h1(`BMI is: ${bmi}`)
        ]))
    return {
        DOM: vtree$
    }
}
const drivers = {
    DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);