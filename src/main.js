require('../static/stylesheets/style.scss');
import {
    Observable
}
from "rx";


function main() {
    return {
        DOM: Observable.timer(0, 1000)
            .map(i => `Seconds elapsed ${i}`),
        // Log: Observable.timer(0, 2000)
        //     .map(i => 2 * i)
    }
}

function DOMEffect(text$) {
    text$.subscribe(text => {
        const container = document.querySelector('#app');
        container.textContent = text;
    })
}

function consoleLogEffect(msg$) {
    msg$.subscribe(msg => console.log(msg));
}

function run(mainFn, effects) {
    const sinks = mainFn();
    DOMEffect(sinks.DOM);
    consoleLogEffect(sinks.Log);
}

const effectsFunctions = {
    DOM: DOMEffect,
    Log: consoleLogEffect,
}

run(main);