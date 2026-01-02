import React from 'react';

export function DropdownMenu({ children }) { return <div className="relative inline-block">{children}</div>; }
export function DropdownMenuTrigger({ children, _asChild }) { return <div>{children}</div>; }
export function DropdownMenuContent({ children, className=''} ) { return <div className={`absolute right-0 mt-2 ${className}`}>{children}</div>; }
export function DropdownMenuItem({ children, onClick, className='' }) { return <div onClick={onClick} className={`px-3 py-2 cursor-pointer ${className}`}>{children}</div>; }

export default DropdownMenu;
