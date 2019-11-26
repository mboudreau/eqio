import {Component, Prop, Element, h, Host, Listen} from '@stencil/core';

@Component({
  tag: 'eq-io',
  styleUrl: 'eq-io.css',
  shadow: true
})
export class EqIo {
  @Prop() debug: true;
  @Element() element: HTMLElement;

  @Listen

  render() {
    return <Host>
      <slot/>
      {this.debug ? <div class="debug">{this.element.offsetWidth} x {this.element.offsetHeight}</div> : ''}
    </Host>
  }
}
