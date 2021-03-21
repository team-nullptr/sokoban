import Layer from '../models/Layer';

interface FormValue {
  name: string;
  type: string;
}

type FormSubscriber<T> = (data: T) => void;

export default class FormWidget extends Layer {
  element = document.createElement('form');

  private subscribers: FormSubscriber<any>[] = [];

  constructor(private values: { name: string; type: string }[]) {
    super();

    // Add event listener for form submition
    this.element.addEventListener('submit', e => {
      e.preventDefault();
      this.notify(Object.fromEntries(new FormData(e.target as HTMLFormElement)));
    });
  }

  /**
   * Notify subscribers about form submit
   * @param data Data send to subscribers
   */
  private notify(data: any) {
    this.subscribers.forEach(subscriber => subscriber(data));
  }

  /**
   * Allow for subscrubung
   * @param handler handler function for event
   */
  subscribe<T>(handler: FormSubscriber<T>) {
    this.subscribers.push(handler);
  }

  render() {
    // Create input elements
    this.values.forEach(value => {
      const input = document.createElement('input');
      input.type = value.type;
      input.name = value.name;
      input.placeholder = value.name;

      this.element.appendChild(input);
    });

    // Create submit button
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.innerHTML = 'submit';

    this.element.appendChild(submit);
  }
}
