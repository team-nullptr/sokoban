import Layer from '../models/Layer';

export default class AuthorsLayer extends Layer {
  readonly element: HTMLElement = document.createElement('aside');

  render(): void {
    this.element.classList.add('authors')
    this.element.innerHTML = '';

    const p = document.createElement('p');
    p.innerHTML = 'Grę stworzyli <a href="https://github.com/bk20dev">Bartosz Bieniek&#129109;</a> oraz <a href="https://github.com/senicko">Sebastian Flajszer&#129109;</a>';

    this.element.appendChild(p);
  }
}
