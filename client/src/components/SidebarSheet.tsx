"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import { Button } from "@/components/shadcn/button";
import { SidebarSheetProps } from "@/types/types";
import { cn } from "@/lib/utils";

function SidebarSheet({
    open,
    onOpenChange,
    side,
    triggerIcon,
    children,
    className,
}: SidebarSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(className, "lg:hidden absolute top-4 z-10")}
                >
                    {triggerIcon}
                </Button>
            </SheetTrigger>
            <SheetContent side={side} className="p-0 w-[90%]">
                {children}
            </SheetContent>
        </Sheet>
    );
}

export default SidebarSheet;
