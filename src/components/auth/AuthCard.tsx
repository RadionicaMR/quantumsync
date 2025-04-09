
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface AuthCardProps {
  children: ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="p-6 shadow-xl">
        {children}
      </Card>
    </motion.div>
  );
};

export default AuthCard;
