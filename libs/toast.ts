import { toast } from "react-toastify";

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
