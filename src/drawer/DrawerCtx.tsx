import React, { ReactNode } from "react";

export interface IDrawerCtx {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }
  
  export const DrawerCtx = React.createContext<IDrawerCtx>(
    {
        visible: false,
        setVisible: (vis: boolean) => {}
    }
  );