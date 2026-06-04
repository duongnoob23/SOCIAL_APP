import React from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

interface FormInput<V> {
  value?: V;
  onChange?: (value: any) => void;  
  onFocus?: () => void;
}

type InputProps<P, FV extends FieldValues> = P & {
  as: React.ComponentType<P>;
  control: Control<FV>;
  name: Path<FV>;
};

export default function Input<
  V,
  FV extends FieldValues,
  P extends FormInput<V>,
>({
  as: Component,
  control,
  onChange: onChangeProp,
  ...props
}: P extends FormInput<V> ? InputProps<P, FV> : InputProps<P, FV>) {
  const {
    field: { value, onBlur, onChange, ref },
  } = useController({ name: props.name, control });

  return (
    <Component
      ref={ref}
      value={value}
      onFocus={() => {
        // Call upstream onFocus if provided so screens can react (e.g., scroll-to-view)
        props?.onFocus?.();
      }}
      onBlur={() => {
        onBlur();
      }}
      onChange={e => {
        onChangeProp?.(e);
        onChange(e);
      }}
      {...props}
    />
  );
}
