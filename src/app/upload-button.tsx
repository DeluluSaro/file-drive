"use client";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";

import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Doc } from "../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});

export default function UploadButton() {
  const organization = useOrganization();
  const user = useUser();
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [loading, setLoading] = useState(false);
  const [isFileDialogClosed, setIsFileDialogClosed] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (!orgId) return;

    const postUrl = await generateUploadUrl();
    const fileType=values.file[0].type
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type":fileType  },
      body: values.file[0],
    });
    const { storageId } = await result.json();
  

    const types={
      "image/png":"image",
      "application/pdf":"pdf",
      "text/csv":"csv"
    }as Record<string,Doc<"files">["type"]>

    console.log(values.file[0].type)
    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type:types[fileType]
      });

      setLoading(false);
      form.reset();
      setIsFileDialogClosed(false);

      toast({
        variant: "success",
        title: "File Created",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    } catch (err) {
      toast({
        variant: "default",
        title: "Something went wrong",
        description: "please retry later,sorry for inconvienience ",
      });
      setLoading(false);
    }
  }

  let orgId: string | null | undefined = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const createFile = useMutation(api.files.createFile);

  return (
    <Dialog open={isFileDialogClosed} onOpenChange={setIsFileDialogClosed}>
      <DialogTrigger asChild>
        <Button>Upload Reports</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Name</FormLabel>
                      <FormControl>
                        <Input placeholder="eg.Diabetes report" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>Selec File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {loading ? (
                    <Loader2Icon className="animate-spin"></Loader2Icon>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
