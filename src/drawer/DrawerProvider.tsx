import React, { ReactNode, FC, useState } from "react";
import { IDrawerCtx, DrawerCtx } from "./DrawerCtx";


export const DrawerProvider: FC<Partial<IDrawerCtx>> = ({
    children
}) => {
    const [isShown, setIsShown] = useState<boolean>(false);

    const defaultDrawerCtx : IDrawerCtx = {
        visible: isShown,
        setVisible: setIsShown
      };
      

    return (
       <DrawerCtx.Provider value={defaultDrawerCtx}>
        {children}
    </DrawerCtx.Provider>);
};

