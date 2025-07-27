import { toast as sonnerToast } from "sonner";

export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
  }: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
        action: {
          label: "Try again",
          onClick: () => {},
        },
      });
    } else {
      sonnerToast(title, { description });
    }
  };

  return { toast };
}
