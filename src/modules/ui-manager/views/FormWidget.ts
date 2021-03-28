import Layer from '../models/Layer';

interface FormValue {
  name: string;
  type: string;
}

type FormSubscriber<T> = (data: T) => void;

export default class FormWidget extends Layer {
  element = document.createElement('div');

  private subscribers: FormSubscriber<any>[] = [];

  // State
  private isOpen = false;

  constructor(private values: { name: string; type: string; min: number }[]) {
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
   * Allow for opening modal
   */
  open() {
    this.isOpen = true;
    this.render();
  }

  /**
   * Allow for closing modal
   */
  close() {
    this.isOpen = false;
    this.render();
  }

  /**
   * Allow for subscrubung
   * @param handler handler function for event
   */
  subscribe<T>(handler: FormSubscriber<T>) {
    this.subscribers.push(handler);
  }

  render() {
    // Remove old content
    this.element.innerHTML = '';

    // Set class for main element
    this.element.classList.add('form-modal');

    if (this.isOpen) this.element.classList.add('form-modal--open');
    else if (!this.isOpen) this.element.classList.remove('form-modal--open');

    // Create wrapper for modal
    const formWrapper = document.createElement('section');
    formWrapper.classList.add('form-wrapper');

    // Form
    const form = document.createElement('form');
    form.classList.add('form-wrapper__form');

    // Create input elements
    this.values.forEach(value => {
      const input = document.createElement('input');
      input.classList.add('form-wrapper__form-input');

      input.type = value.type;
      input.name = value.name;
      input.placeholder = value.name;
      input.min = value.min.toString();
      form.appendChild(input);
    });

    // Create title for modal
    const modalTitle = document.createElement('h1');
    modalTitle.classList.add('form-wrapper__title');
    modalTitle.innerHTML = 'Change grid size';
    formWrapper.appendChild(modalTitle);

    // Create cancle button
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = 'close';
    cancelButton.classList.add('form-wrapper__close-button');
    cancelButton.addEventListener('click', () => this.close());

    // Create submit button
    const submit = document.createElement('button');
    submit.classList.add('form-wrapper__form-submit');
    submit.type = 'submit';
    submit.innerHTML = 'submit';

    form.appendChild(submit);
    formWrapper.appendChild(form);
    formWrapper.appendChild(cancelButton);

    // Attach form to section element
    this.element.append(formWrapper);
  }
}
