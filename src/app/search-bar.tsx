import { Button } from "@/components/ui/button";
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
import { Loader2Icon, Search } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

export function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query);
  }
  return (
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex  items-center gap-4"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>File Name</FormLabel> */}
                <FormControl>
                  <Input placeholder="search using your file name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
          size="sm"
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2Icon className="h-4 w-4 animate-spin"></Loader2Icon>
            )}
            <Search></Search> Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
