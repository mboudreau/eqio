import {html, css, LitElement} from 'lit-element';

export class Eqio extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-grow: 1;
      }
    `;
  }

  static get properties() {
    return {
      sizes: {type: String},
      prefix: {type: String},
      debug: {type: Boolean},
    };
  }

  get container() {
    return this.shadowRoot.querySelector('.container');
  }

  constructor() {
    super();
    if (!('IntersectionObserver' in window)) {
      // eslint-disable-next-line no-console
      console.warn(`IntersectionObserver doesn't exist`);
      return;
    }
    this.sizes = '[]';

    this.createStyles();
    this.createTriggers();
    this.createObservers();
  }

  get classes() {
    const c = [];
    if(this.debug) {
      c.push('debug');
    }
    return c.join(' ')
  }

  render() {
    return html`
      <div class="container ${this.classes}">
        <slot/>
      </div>
    `;
  }

  createStyles() {
    if (!this.shadowRoot.querySelector('#eqio-req-css')) {
      const style = document.createElement('style');
      style.id = 'eqio-req-css';
      style.type = 'text/css';
      style.innerHTML = `
                .eqio {
                  position: relative;
                }

                .eqio__trigger {
                  height: 1px;
                  left: 0;
                  pointer-events: none;
                  position: absolute;
                  top: 0;
                  visibility: hidden;
                  z-index: -1;
                }
        `;
      this.shadowRoot.appendChild(style);
    }
  }

  createTriggers() {
    this.sizesArray = JSON.parse(this.sizes);
    this.triggerEls = [];
    let triggerEl;
    const fragment = document.createDocumentFragment();

    this.sizesArray.forEach((trigger) => {
      triggerEl = document.createElement('div');
      triggerEl.className = 'eqio__trigger';
      triggerEl.setAttribute('data-eqio-size', trigger);
      triggerEl.style.width = `${trigger.slice(1)}px`;

      this.triggerEls.push(triggerEl);
      fragment.appendChild(triggerEl);
    });

    this.shadowRoot.appendChild(fragment);
  }

  createObservers() {
    const prefix = this.prefix ? `${this.prefix}-` : '';
    const className = `${prefix}eqio-`;
    const observerOptions = {
      root: this.container,
      rootMargin: '0px',
      threshold: 1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const size = entry.target.dataset.eqioSize;

        if (size.indexOf('>') === 0) {
          if (entry.intersectionRatio === 1) {
            this.container.classList.add(`${className}${size}`);
          } else {
            this.container.classList.remove(`${className}${size}`);
          }
        } else if (entry.intersectionRatio === 1) {
          this.container.classList.remove(`${className}${size}`);
        } else {
          this.container.classList.add(`${className}${size}`);
        }
      });
    };

    this.observer = new IntersectionObserver(observerCallback, observerOptions);
    this.sizesArray.forEach((size, index) => {
      this.observer.observe(this.triggerEls[index]);
    });
  }
}
