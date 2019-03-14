interface Observer {
    update(eventName: String): void;
}

interface Observable {
    registerObserver(o: Observer): void;

    removeObserver(o: Observer): void;

    notifyObservers(eventName: String): void;
}

class ConcreteObserver implements Observer {
    public update(eventName: String): void {
        console.log(`Event [${eventName}] occurred!`);
    }
}

class ConcreteObservable implements Observable {
    private observers: Set<Observer> = new Set();

    public notifyObservers(eventName: String): void {
        this.observers.forEach(observer => observer.update(eventName))
    }

    public registerObserver(observer: Observer): void {
        this.observers.add(observer);
    }

    public removeObserver(observer: Observer): void {
        this.observers.delete(observer);
    }
}

const observer = new ConcreteObserver();
const observable = new ConcreteObservable();

observable.registerObserver(observer);
observable.registerObserver(observer);
observable.registerObserver(observer);

observable.notifyObservers("Test event");
observable.registerObserver(observer);