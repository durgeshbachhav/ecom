
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
import { PencilIcon } from "lucide-react";
import { useState } from "react";

const UpdateOrderStatus = () => {
     const [isOpen, setIsOpen] = useState(false);

     return (
          <Dialog>
               <DialogTrigger onClick={() => setIsOpen(true)} asChild >
                    <Button variant="outline">Update Status</Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle>Update Order Status</DialogTitle>
                         <DialogDescription>
                              Please enter the new status for the order.
                         </DialogDescription>
                    </DialogHeader>

                    <h1>update status</h1>
                    <DialogFooter className="sm:justify-start">
                         <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                   Cancel
                              </Button>
                         </DialogClose>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
}

export default UpdateOrderStatus;