import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Label } from "./label";

interface RejectBookingDialogProps {
  children: React.ReactNode;
  onReject: (reason: string) => void;
}

export function RejectBookingDialog({ children, onReject }: RejectBookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (reason.trim()) {
      onReject(reason);
      setReason("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Booking Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this booking request. This will help the student understand and find alternative options.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Rejection</Label>
            <Textarea
              id="reason"
              placeholder="e.g., No available slots at requested time, emergency scheduling conflict, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={!reason.trim()}>
            Reject Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}