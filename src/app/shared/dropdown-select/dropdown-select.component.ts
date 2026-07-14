import {
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class DropdownSelectComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);

  icon = input<string>('fa-chevron-down');
  placeholder = input<string>('Sélectionner');
  options = input<DropdownOption[]>([]);

  isOpen = signal(false);
  value = signal<string>('');
  disabled = signal(false);

  selectedLabel = computed(() => {
    const found = this.options().find((o) => o.value === this.value());
    return found ? found.label : this.placeholder();
  });

  hasValue = computed(() => this.value() !== '');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update((open) => !open);
  }

  select(option: DropdownOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.isOpen.set(false);
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
}