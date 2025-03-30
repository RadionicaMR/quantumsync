
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

const QuantumButton = ({ 
  children, 
  onClick, 
  className, 
  variant = 'default',
  size = 'default',
  disabled = false,
}: QuantumButtonProps) => {
  let buttonClass = '';
  
  if (variant === 'default') {
    buttonClass = 'quantum-button rounded-xl';
  } else if (variant === 'outline') {
    buttonClass = 'rounded-xl bg-transparent text-quantum-primary font-medium px-6 py-3 border-2 border-quantum-primary hover:bg-quantum-primary/10 transition-colors duration-300';
  } else if (variant === 'secondary') {
    buttonClass = 'rounded-xl bg-quantum-tertiary text-white font-medium px-6 py-3 shadow-md shadow-quantum-tertiary/20 hover:shadow-lg hover:shadow-quantum-tertiary/30 hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300';
  } else if (variant === 'ghost') {
    buttonClass = 'rounded-xl bg-transparent text-quantum-primary font-medium px-6 py-3 hover:bg-quantum-primary/10 transition-colors duration-300';
  }
  
  if (size === 'sm') {
    buttonClass += ' text-sm px-4 py-2';
  } else if (size === 'lg') {
    buttonClass += ' text-lg px-8 py-4';
  } else if (size === 'icon') {
    buttonClass = buttonClass.replace('px-6 py-3', 'p-2');
  }

  return (
    <Button 
      onClick={onClick} 
      className={cn(buttonClass, className)}
      variant={variant === 'default' ? 'default' : variant}
      size={size}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default QuantumButton;
