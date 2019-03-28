import { of , Observable } from 'rxjs';
import { map } from 'rxjs/operators';


// Manually creating observable

// Observables are a function that take an observer and return a function. Nothing more, nothing less!

// Observable WRAPS some event source (called producer) and calls
// "observer.next" when that source emits value. Subscribers may
// subscribe to the observable to get the value "next" emits.

// This is the data source we wrap (a producer)
class DataSource {
  ondata: (i: number) => void;
  onerror: (i: number) => void;
  oncomplete: (i: number) => void;

  intervalId;

  constructor() {
    let i = 0;
    setInterval(() => {
      this.ondata(i++)
    }, 1000);
  }

  destroy() {
    clearInterval(this.intervalId);
  }
}

// When data source emits a value, we call next
function myObservable(observer) {

  // This is an example of a cold observable because the procuder
  // is created inside the observable

  const datasource = new DataSource();
  datasource.ondata = (e) => observer.next(e);
  datasource.onerror = (err) => observer.error(err);
  datasource.oncomplete = () => observer.complete();
  return () => {
    datasource.destroy();
  };
}

myObservable({next: (v) => console.log(v)});


var observable = Observable.create((observer:any) => {
    observer.next('Hey guys!')
})

observable.subscribe(x => console.log(x))