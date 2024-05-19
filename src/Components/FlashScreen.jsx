import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FlashScreen(params) {
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(()=>{
            navigate('/home')
        },2000)
    },[])
  return (
    <>
      <div class="bg-blue-500 absolute top-0 bottom-0 left-0 right-0 flex">
        <div class="zoom-in-out-box font-bold m-auto">
          <span class="text-white">Digital</span> Branded School Solutions
        </div>
      </div>
    </>
  );
}
