import { BiLoaderAlt } from "react-icons/bi";

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex z-999 justify-center items-center  backdrop-blur-md">
      <div className="animate-spin duration-200 text-norway-50 " >
        <BiLoaderAlt size={30} />
      </div>
    </div>
  );
};
