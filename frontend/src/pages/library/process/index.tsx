
// import EditDeleteDialog from '@/components/editDeleteDialog'
// import SuccessToast from '@/components/successToast'

import ConfirmDialog from "@/components/ConfirmDialog"
import React, { useState } from 'react';

const Index = () => {
    // <EditDeleteDialog />
    // <SuccessToast
    //   message="Success! The Asset #002 has been deleted."
    // />

  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log("Confirmed");
          setOpen(false);
        }}
        title="Cancel Risk Scenario Creation?"
        description="Are you sure you want to cancel the risk scenario creation? Any unsaved changes will be lost."
        cancelText="Continue Editing"
        confirmText="Yes, Cancel"
        confirmColor="#B00020"
      />
    </>
  )
}

export default Index