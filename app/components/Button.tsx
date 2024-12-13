import { ReactElement } from "react";

interface btnProps {
    text: string;
    icon: ReactElement;
  }
  
  const Button = ({ text, icon }: btnProps) => {
    return (
      <button className="flex items-center p-2 text-base-100 border-2 border-orange-500 font-semibold hover:bg-green-800 hover:text-base-100 hover:transition-all duration-75 ease-in-out">
        {icon} {text}
      </button>
    );
  };
  
  export default Button;
  