import { ReactNode } from "react";

export function IconButton({icon,onClick,activated}:{
  icon:ReactNode,
  onClick:()=>void,
  activated:boolean
}){
  return (
    <div onClick={onClick} className={`rounded-full border pointer p-2 hover:text-gray-400 m-2 ${activated?"text-red-600":"text-white"}`}>
      {icon}
    </div>
  )
}