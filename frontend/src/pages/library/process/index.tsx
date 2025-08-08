import MenuItemComponent from '@/components/MenuItemComponent'
import FilterComponent from '@/components/Library/FilterComponent';
import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import ToastComponent from '@/components/ToastComponent'
// import ConfirmDialog from "@/components/ConfirmDialog"
import React, { useState } from 'react';

const Index = () => {



  // const [open, setOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const dialogData = [{
    onAction: () => { console.log("Edit action"); },
    color: 'primary.main',
    action: 'Edit',
    icon: <EditOutlined fontSize="small" />
  },
  {
    onAction: () => { console.log("Delete action"); },
    color: '#CD0303',
    action: 'Delete',
    icon: <DeleteOutlineOutlined fontSize="small" />
  }
  ]

  const [openFilter, setOpenFilter] = useState(false);

  const statusItems = ['Published', 'Draft', 'Disabled'];

  return (
    <>

      <MenuItemComponent items={dialogData} />

      <Button onClick={() => setOpenFilter(true)}>Open Filter</Button>

      <Button onClick={() => setOpenSnackbar(true)}>Open Alert</Button>

      <FilterComponent items={statusItems} open={openFilter} onClose={() => setOpenFilter(false)} onClear={() => console.log("Cleared")} onApply={() => console.log("Applied")} />

      {/* <button onClick={() => setOpen(true)}>Open Modal</button>

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
      /> */}

      <ToastComponent open={openSnackbar} onClose={() => setOpenSnackbar(false)}
        message="Success! The Asset #002 has been deleted." 
        toastBorder='1px solid #147A50' 
        toastColor='#147A50' 
        toastBackgroundColor='#DDF5EB'
        toastSeverity='success'
      />



    </>
  )
}

export default Index