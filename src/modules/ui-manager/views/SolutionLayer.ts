import Layer from '../models/Layer';

interface TwoLineText {
  title: string;
  value: string | string[];
}

export default class SolutionLayer extends Layer {
  element = document.createElement('section');

  private lines: TwoLineText[] = [];

  set(text: TwoLineText[]) {
    this.lines = text;
    this.render();
  }

  render(): void {
    this.element.classList.add('solution');
    this.element.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'container';

    this.lines.forEach(line => {
      const wrapper = document.createElement('div');

      const title = document.createElement('p');
      title.className = 'title';
      title.innerText = line.title;
      wrapper.appendChild(title);

      if (typeof line.value === 'string') {
        const content = document.createElement('p');
        content.innerText = line.value;
        wrapper.appendChild(content);
      } else {
        line.value.forEach(text => {
          const p = document.createElement('p');
          p.textContent = text;

          wrapper.appendChild(p);
        });
      }

      container.appendChild(wrapper);
    });

    this.element.appendChild(container);
  }
}
