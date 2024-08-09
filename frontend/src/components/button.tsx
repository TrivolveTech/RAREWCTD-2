import { type ButtonHTMLAttributes } from 'react';
import { motion, type MotionProps } from "framer-motion";

// Merge ButtonHTMLAttributes<HTMLButtonElement> with MotionProps
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>, MotionProps {
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            // whileTap={{ background: "#2cb9c3" }}
            className={`${className}`}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;