import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#ccd0d5] dark:border-[#5c5f62] bg-[#F0F2F5] dark:bg-[#3A3B3C] px-4 py-2 text-sm text-[#232946] dark:text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8A8D91] dark:placeholder:text-[#A3BCF9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 shadow-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input }; 