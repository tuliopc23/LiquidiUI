import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { motion } from 'framer-motion';
import { cn } from '../../lib/glass-utils';
import { cva, type VariantProps } from 'class-variance-authority';

const radioGroupVariants = cva('grid gap-2', {
  variants: {
    orientation: {
      horizontal: 'grid-flow-col',
      vertical: 'grid-flow-row',
    },
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    size: 'md',
  },
});

const radioItemVariants = cva(
  [
    'group flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-200',
    'hover:bg-white/5 focus:bg-white/10 focus:outline-none',
    'data-[state=checked]:bg-white/10 data-[state=checked]:shadow-lg',
    'backdrop-blur-md border border-white/10',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm p-1.5 gap-1.5',
        md: 'text-base p-2 gap-2',
        lg: 'text-lg p-3 gap-3',
      },
      variant: {
        default: 'bg-white/5 hover:bg-white/10',
        solid: 'bg-white/10 hover:bg-white/15',
        ghost: 'bg-transparent hover:bg-white/5',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

const radioIndicatorVariants = cva([
  'relative w-5 h-5 rounded-full border-2 border-white/20',
  'group-data-[state=checked]:border-blue-400',
  'group-data-[state=checked]:bg-gradient-to-br group-data-[state=checked]:from-blue-400/20 group-data-[state=checked]:to-purple-400/20',
  'transition-all duration-200 backdrop-blur-sm',
  'group-hover:border-white/40 group-focus:border-blue-400',
]);

export interface GlassRadioGroupProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
      'orientation'
    >,
    VariantProps<typeof radioGroupVariants> {
  children: React.ReactNode;
}

export interface GlassRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {
  children: React.ReactNode;
  value: string;
  id?: string;
}

const GlassRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  GlassRadioGroupProps
>(({ className, orientation, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupVariants({ orientation, size }), className)}
      {...props}
      ref={ref}
    />
  );
});

const GlassRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  GlassRadioItemProps
>(({ className, children, size, variant, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(radioItemVariants({ size, variant }), className)}
        {...props}
      >
        <div className={cn(radioIndicatorVariants())}>
          <RadioGroupPrimitive.Indicator asChild>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 30 }}
              className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg"
            />
          </RadioGroupPrimitive.Indicator>
        </div>
        <div className="flex-1">{children}</div>
      </RadioGroupPrimitive.Item>
    </motion.div>
  );
});

GlassRadioGroup.displayName = 'GlassRadioGroup';
GlassRadioItem.displayName = 'GlassRadioItem';

// Compound component pattern
const RadioGroup = Object.assign(GlassRadioGroup, {
  Item: GlassRadioItem,
});

export { RadioGroup, GlassRadioGroup, GlassRadioItem };
