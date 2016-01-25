import {Subject} from "rx";
function run(mainFn, drivers) {
    const proxySources = {};
    Object.keys(drivers).forEach(key =>{
        proxySources[key] = new Subject();
    })
    const sinks = mainFn(proxySources);
    Object.keys(drivers)
          .forEach(key => {
            const source = drivers[key](sinks[key])
            if(source) source.subscribe(x => proxySources[key].onNext(x));
          })
}
const mySimpleCycle ={
    run
};

export default mySimpleCycle;