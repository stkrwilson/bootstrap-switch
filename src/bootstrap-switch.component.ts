import {
  Component, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, Renderer, AfterViewInit, AfterViewChecked,
  trigger,
  state,
  style,
  transition,
  animate,
  ViewEncapsulation
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'switch',
  template: `<div #main class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-off" [ngClass]="_sizeClass + ' ' + _disabledClass" (click)="toggleStatus()">
	<div #container class="bootstrap-switch-container"  [@statusChange]="_statusStr" >
        <span #on class="bootstrap-switch-handle-on" [ngClass]="_onColor" [ngStyle]="{'min-width': _minWidth +'px'}">{{onText}}</span>
        <span #mid class="bootstrap-switch-label"></span>
        <span #off class="bootstrap-switch-handle-off " [ngClass]="_offColor">{{offText}}</span>
    </div>
</div>
`,
  styles: [``],
  animations: [
    trigger('statusChange', [
      state('false', style({ transform: 'translateX(-33.333%)' })),
      state('true', style({ transform: 'translateX(0)' })),
      transition('true <=> false', animate('200ms'))
    ])
  ]
})
export class BootstrapSwitchComponent implements OnChanges, AfterViewInit, AfterViewChecked {

  @ViewChild('on') _onSpan: ElementRef;
  @ViewChild('off') _offSpan: ElementRef;
  @ViewChild('mid') _midSpan: ElementRef;
  @ViewChild('container') _container: ElementRef;
  @ViewChild('main') _main: ElementRef;


  // public properties
  @Input() status = false;
  @Output() statusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() onText = 'on';
  @Input() offText = 'off';
  @Input() onColor = 'bootstrap-switch-info';
  @Input() offColor = 'bootstrap-switch-default';
  @Input() size = 'normal';
  @Input() disabled = false;

  _statusStr = 'false';

  // styles properties
  _onColor = 'bootstrap-switch-info';
  _offColor = 'bootstrap-switch-default';
  _minWidth = 60;
  _sizeClass = 'bootstrap-switch-normal';
  _disabledClass = '';
  _needCalculateWidth = false;

  constructor(private el: ElementRef, private renderer: Renderer) {
    this._calculateSize();
  }



  toggleStatus(): void {
    if (!this.disabled) {
      this.status = !this.status;
      this._statusStr = this.status.toString();
      this.statusChange.emit(this.status);
    }
  }

  private _setDisabled(disabled: boolean): void {
    if (disabled) {
      this._disabledClass = 'bootstrap-switch-disabled'
    } else {
      this._disabledClass = '';
    }
  }

  private _setColor(switchLabel: string, value: string): void {
    let color = '';
    let defaultColor = 'bootstrap-switch-info';

    if (switchLabel === 'off') {
      defaultColor = 'bootstrap-switch-default';
    }

    switch (value) {
      case 'default':
        color = defaultColor;
        break;
      case 'blue':
        color = 'bootstrap-switch-primary';
        break;
      case 'sky-blue':
        color = 'bootstrap-switch-info';
        break;
      case 'red':
        color = 'bootstrap-switch-danger';
        break;
      case 'yellow':
        color = 'bootstrap-switch-warning';
        break;
      case 'green':
        color = 'bootstrap-switch-success';
        break;
      case 'gray':
        color = 'bootstrap-switch-default';
        break;
    }

    if (switchLabel === 'off') {
      this._offColor = color;
    } else {
      this._onColor = color;
    }
  }

  private _calculateWidth(): void {
    if (this._onSpan) {
      this.renderer.setElementStyle(this._onSpan.nativeElement, 'width', '');
      this.renderer.setElementStyle(this._midSpan.nativeElement, 'width', '');
      this.renderer.setElementStyle(this._offSpan.nativeElement, 'width', '');
      this.renderer.setElementStyle(this._main.nativeElement, "width", "");

      const width = Math.max(this._onSpan.nativeElement.clientWidth, this._offSpan.nativeElement.clientWidth, this._minWidth);

      this.renderer.setElementStyle(this._onSpan.nativeElement, 'width', width.toString() + 'px');
      this.renderer.setElementStyle(this._midSpan.nativeElement, 'width', (width - 10).toString() + 'px');
      this.renderer.setElementStyle(this._offSpan.nativeElement, 'width', width.toString() + 'px');
      this.renderer.setElementStyle(this._container.nativeElement, 'width', (width * 3).toString() + 'px');
      this.renderer.setElementStyle(this._main.nativeElement, 'width', (width * 2).toString() + 'px');
    }
  }

  private _calculateSize(): void {
    switch (this.size) {
      case 'mini':
        this._sizeClass = 'bootstrap-switch-mini';
        this._minWidth = 25;
        break;
      case 'small':
        this._sizeClass = 'bootstrap-switch-small';
        this._minWidth = 30;
        break;
      case 'normal':
        this._sizeClass = 'bootstrap-switch-normal';
        this._minWidth = 60;
        break;
      case 'large':
        this._sizeClass = 'bootstrap-switch-large';
        this._minWidth = 80;
        break;
    }

    this._needCalculateWidth = true;
  }

  ngAfterViewChecked(){
    if(this._needCalculateWidth){
      this._calculateWidth();
      this._needCalculateWidth = false;
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const log: string[] = [];
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const changedProp = changes[propName];
        const from = changedProp.previousValue;
        const value = changedProp.currentValue;

        switch (propName) {
          case 'onText':
            this._needCalculateWidth = true;
            break;
          case 'offText':
            this._needCalculateWidth = true;
            break;
          case 'onColor':
            this._setColor('on', value);
            break;
          case 'offColor':
            this._setColor('off', value);
            break;
          case 'status':
            this._statusStr = value.toString();
            break;
          case 'size':
            this._calculateSize();
            break;
          case 'disabled':
            this._setDisabled(value);
            break;
        }
      }
    }
  }

  ngAfterViewInit() {
    // this._calculateSize('normal');
    // this._calculateWidth();
  }
}
