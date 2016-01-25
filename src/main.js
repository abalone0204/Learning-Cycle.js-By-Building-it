require('../static/stylesheets/style.scss');
import Cycle from '@cycle/core';
import {
    h1, h4, button, a, div, makeDOMDriver
}
from '@cycle/dom';
import {
    makeHTTPDriver
}
from '@cycle/http';

import Rx from "rx";

const API_URL = 'https://api.github.com/users/abalone0204';

function main(sources) {
    const clickEv$ = sources.DOM
        .select('.get_user').events('click');
    const request$ = clickEv$.map(_ => {
        return {
            url: API_URL,
            method: 'GET',
        }
    })
    const response$$ = sources.HTTP
        .filter(response$ => response$.request.url === API_URL)
    const response$ = response$$.switch();
    const firstUser$ = response$.map(res => res.body)
    .startWith({});
    return {
        DOM: firstUser$.map(user =>
            div([
                button('.get_user', ['Get user']),
                div('.user_details', [
                    h1('.user_name', user.name),
                    h4('.email', user.email),
                    a('.web', {
                        href: user.url
                    }, user.url)
                ])
            ])
        ),
        HTTP: request$
    }
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers);