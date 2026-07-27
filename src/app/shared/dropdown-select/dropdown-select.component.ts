import {
  Component,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSelectComponent),
      multi: true,
    },
  ],
})
export class DropdownSelectComponent implements ControlValueAccessor, OnDestroy {
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  @ViewChild('dropdownContent') dropdownTemplate!: TemplateRef<unknown>;
  @ViewChild('triggerButton') triggerButton!: ElementRef<HTMLButtonElement>;

  private embeddedView: EmbeddedViewRef<unknown> | null = null;

  icon = input<string>('fa-chevron-down');
  placeholder = input<string>('Sélectionner');
  options = input<DropdownOption[]>([]);

  isOpen = signal(false);
  value = signal<string>('');
  disabled = signal(false);
  menuPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });

  selectedLabel = computed(() => {
    const found = this.options().find((o) => o.value === this.value());
    return found ? found.label : this.placeholder();
  });

  hasValue = computed(() => this.value() !== '');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const clickedInsideTrigger = this.elementRef.nativeElement.contains(target);
    const clickedInsideMenu = this.embeddedView?.rootNodes.some((node: Node) =>
      node.contains?.(target)
    );
    if (!clickedInsideTrigger && !clickedInsideMenu) {
      this.close();
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.isOpen()) {
      this.updatePosition();
    }
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen.set(true);
    this.embeddedView = this.viewContainerRef.createEmbeddedView(this.dropdownTemplate);
    this.embeddedView.rootNodes.forEach((node) =>
      this.renderer.appendChild(this.document.body, node)
    );
    this.updatePosition();
  }

  private close(): void {
    this.isOpen.set(false);
    this.embeddedView?.destroy();
    this.embeddedView = null;
  }

  private updatePosition(): void {
    const triggerRect = this.triggerButton.nativeElement.getBoundingClientRect();
    const menuEl = this.embeddedView?.rootNodes.find(
      (node: Node): node is HTMLElement => node instanceof HTMLElement && node.tagName === 'UL'
    );
    const menuWidth = menuEl?.offsetWidth ?? 180; // fallback sur min-w-[180px]

    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenter - menuWidth / 2;

    // Empêche le menu de sortir de l'écran sur les bords
    const margin = 8;
    left = Math.max(margin, Math.min(left, window.innerWidth - menuWidth - margin));

    this.menuPosition.set({
      top: triggerRect.bottom + 8,
      left,
    });
  }

  select(option: DropdownOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.close();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  ngOnDestroy(): void {
    this.embeddedView?.destroy();
  }
}