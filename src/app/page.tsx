import VerifyCardButton from "@/RFID/VerifyButton";
import AddCardButton from "@/RFID/AddButton";

export default function LandingPage() {
  return (
   <div>
    <h1 className="mx-10 mt-10 font-bold text-3xl ">Verify Card </h1>
    <h2 className="mx-11 mt-2 font-bold text-xs text-gray-500">Verify your RFID card here to purse to next page to upload report</h2>


    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <VerifyCardButton></VerifyCardButton>
      <AddCardButton></AddCardButton>
      
    </div>

   </div>
  );
}
