import toast from "react-hot-toast";

const notify = ({ type, text }: { type: string; text: any }) => {
  switch (type) {
    case "success":
      toast.success(text);
      break;
    case "error":
      toast.error(text?.toString());
      break;
    default:
      break;
  }
};

export default notify;
