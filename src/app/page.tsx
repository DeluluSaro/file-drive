"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";

import { z } from "zod";

import UploadButton from "./upload-button";
import FileCard from "./file-card";
import Image from "next/image";
import { Hospital, Loader2, SparklesIcon, SplineIcon } from "lucide-react";

import { useState } from "react";
import { SearchBar } from "./search-bar";

const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});
function PlaceHolder() {
  return (
    <div className="flex flex-col w-[1275px] mr-10  items-center gap-4 mt-10 ">
      <Image
        src={require("./../../public/nothing.svg")}
        alt="nothing"
        width={100}
        height={100}
        className="w-[250px] h-[250px] "
      ></Image>
      <h1 className="text-2xl font-bold">No Records Found</h1>
      <UploadButton></UploadButton>
    </div>
  );
}
export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | null | undefined = null;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip");
  const isLoading = files == undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full  items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500"></Loader2>
          <div className="text-2xl"> Loading you images...</div>
        </div>
      )}

      {/* {!isLoading  && !query && files.length === 0 && <PlaceHolder></PlaceHolder>} */}

      {!isLoading &&  (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Your Reports</h1>
            <SearchBar query={query} setQuery={setQuery}></SearchBar>
            <UploadButton></UploadButton>
          </div>

          {files.length === 0 && <PlaceHolder></PlaceHolder>

        // <div className="flex flex-col gap-8  w-full  items-center mt-24">
        //   <Image
        //     alt="an empty image"
        //     src="/nothing.svg"
        //     width={300}
        //     height={300}
        //   ></Image>
        //   <div className="text-2xl"> You have no files ,upload one now</div>
        //   <UploadButton></UploadButton>
        // </div>
      }

          <div className="grid grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file}></FileCard>;
            })}
          </div>
        </>
      )}
    </main>
  );
}
