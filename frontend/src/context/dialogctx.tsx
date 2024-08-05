import { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextProps {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <DialogContext.Provider value={{ isDialogOpen, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
