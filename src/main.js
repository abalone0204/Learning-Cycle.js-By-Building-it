require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
// import {h, h1, span, makeDOMDriver} from './mySimpleCycleDOM.js';
import {h, h1, span, makeDOMDriver} from '@cycle/dom';
// import {run} from './mySimpleCycle.js';

import {
    Observable, Subject
}
from "rx";
 


const drivers = {
    DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers);