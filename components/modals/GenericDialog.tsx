import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GenericDialog({
  children,
  title,
  description,
  dialogContentClassName,
  dialogFooter,
  dialogTrigger,
  open,
  onOpenChange,
  hideHeader,
  size,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  dialogContentClassName?: string;
  dialogFooter?: React.ReactNode;
  dialogTrigger?: React.ReactNode;
  open: boolean;
  onOpenChange: () => void;
  hideHeader?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  function getModalSize() {
    switch (size) {
      case "sm":
        return "sm:max-w-[425px]";
      case "md":
        return "sm:max-w-[600px]";
      case "lg":
        return "sm:max-w-[800px]";
      default:
        return "sm:max-w-[425px]";
    }
  }
  return (
    <Dialog
      open={open}
      key={title}
      modal={true}
      onOpenChange={() => {
        onOpenChange();
      }}
    >
      {dialogTrigger && <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>}
      <DialogContent
        style={{
          maxHeight: "100vh",
          overflowY: "auto",
        }}
        className={`${
          dialogContentClassName && dialogContentClassName
        } ${getModalSize()}`}
      >
        {!hideHeader && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}
        {children}
        {dialogFooter && <DialogFooter>{dialogFooter}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
