require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
import {
    label, input, h1, hr, div, makeDOMDriver
}
from '@cycle/dom';

import Rx from "rx";

function main(sources) {

}

const drivers = {
    DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers);