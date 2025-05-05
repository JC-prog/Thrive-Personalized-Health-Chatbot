export interface FormData {
    name: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }
  
export interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }
  