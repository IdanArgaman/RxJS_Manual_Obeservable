import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

//////////////////////////////////
// Manually creating observable //
//////////////////////////////////

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

myObservable(/* passing an observer as an object */{ next: (v) => console.log(v) });

//////////////////////////////////////////////
// Ccreating observable using the framework //
//////////////////////////////////////////////

var observable = Observable.create((observer: any) => {
  observer.next('Hey guys!'); // calling the observer
})

observable.subscribe(/* pass an observer as a function */ x => console.log(x))

/////////////////////////////////
// Manually creating fromEvent //
/////////////////////////////////

/* In order for an observer to see the items being emitted by an Observable, or to receive error or completed 
   notifications from the Observable, it must first subscribe to that Observable with the subscribe operator. */

/* An Observable is called a “cold” Observable if it does not begin to emit items until an observer has subscribed 
   to it; an Observable is called a “hot” Observable if it may begin emitting items at any time, and a subscriber may 
   begin observing the sequence of emitted items at some point after its commencement, missing out on any items emitted
   previously to the time of the subscription. */

function fromEvent(target, eventName) {

  // The observable's job is to call next, error, complete on the passed observer
  // the observer is provided when the caller call subscribe on the observable

  return new Observable((observer) => {
    const handler = (e) => observer.next(e);

    // Add the event handler to the target
    target.addEventListener(eventName, handler);

    // Providing a function to unsubscribe
    return () => {
      // Detach the event handler from the target
      target.removeEventListener(eventName, handler);
    };
  });
}

const ESC_KEY = 27;
const nameInput = document.getElementById('name') as HTMLInputElement;

// We can subscribe to the observable by providing 3 functions to the subscribe method
// the first function is for "next", the second is for "error" and the last is for "complete"
const subscription_1 = fromEvent(nameInput, 'keydown')
  .subscribe(/* observer as function */(e: KeyboardEvent) => {
    if (e.keyCode === ESC_KEY) {
      nameInput.value = '';
    }
  });

// Or we can pass object with methods named: next, error , complete
const subscription_2 = fromEvent(nameInput, 'keydown')
  .subscribe(/* observer as an object implementing the required interface */ {
    // ES6 syntax for creating a method
    next(e: KeyboardEvent) {
      if (e.keyCode === ESC_KEY) {
        nameInput.value = '';
      }
    }
  });