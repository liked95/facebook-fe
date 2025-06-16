import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'font-facebook font-sans rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#1877F2] text-white hover:bg-[#166FE5]',
        secondary: 'bg-[#E4E6EB] text-[#050505] hover:bg-[#D8DADF] dark:bg-[#3A3B3C] dark:text-[#E4E6EB] dark:hover:bg-[#4A4B4D]',
        danger: 'bg-[#FA3E3E] text-white hover:bg-[#E03131]',
        ghost: 'bg-transparent text-[#050505] hover:bg-[#E4E6EB] dark:text-[#E4E6EB] dark:hover:bg-[#3A3B3C]',
        outline: 'border border-[#DADDE1] dark:border-[#3E4042] bg-white dark:bg-[#242526] text-[#050505] dark:text-[#E4E6EB] hover:bg-[#E4E6EB] dark:hover:bg-[#3A3B3C]',
        link: 'text-[#1877F2] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10 flex justify-center items-center p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 