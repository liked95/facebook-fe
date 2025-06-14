import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-[#ccd0d5] dark:border-[#5c5f62] bg-[#F0F2F5] dark:bg-[#3A3B3C] px-4 py-2 text-sm text-[#232946] dark:text-white ring-offset-background placeholder:text-[#8A8D91] dark:placeholder:text-[#A3BCF9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 shadow-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea }; 