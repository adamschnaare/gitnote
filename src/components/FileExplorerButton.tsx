import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FileExplorer from "./FileExplorer";

export function FileExplorerButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden">File Explorer</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>FileExplorer</SheetTitle>
        </SheetHeader>
        {/* <div className="grid flex-1 auto-rows-min gap-6 px-4"> */}
        <FileExplorer />
        {/* </div> */}
      </SheetContent>
    </Sheet>
  );
}
