import React, { ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  EllipsisVertical,
  FileCode,
  FileSpreadsheet,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  Trash2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function FileCardActions({ file }: { file: Doc<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile);
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  variant: "success",
                  title: "File Deleted",
                  description:
                    "The selected file has been deleted successfully.",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          {" "}
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setIsConfirmOpen(true)}
            className="flex gap-2 items-center text-red-500 cursor-pointer"
          >
          
            <Trash2Icon></Trash2Icon> Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

function FileCard({ file }: { file: Doc<"files"> }) {
  const typeIcons = {
    image: <ImageIcon></ImageIcon>,
    pdf: <FileTextIcon></FileTextIcon>,
    csv: <GanttChartIcon></GanttChartIcon>,
  } as Record<string, ReactNode>;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {" "}
            {file.name}
            <div>{typeIcons[file.type]}</div>
          </div>{" "}
          <FileCardActions file={file}></FileCardActions>
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="flex justify-center">
        {file.type === "image" && (
    <Image alt={file.name} src={getFileUrl(file.fileId)} width={200} height={100}></Image>  
    // <ImageIcon className="w-32 h-32"></ImageIcon>   
        )}
         {file.type === "pdf" && (
    // <Image alt={file.name} src={getFileUrl(file.fileId)} width={200} height={100}></Image>  
      <FileCode className="w-32 h-32"></FileCode>
        )}
         {file.type === "csv" && (
    // <Image alt={file.name} src={getFileUrl(file.fileId)} width={200} height={100}></Image>  
    <FileSpreadsheet className="w-32 h-32"></FileSpreadsheet>   
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={()=>{
          window.open(getFileUrl(file.fileId),"_blank")
        }} className="flex gap-2 items-center j">
          <DownloadIcon></DownloadIcon>Download
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FileCard;
