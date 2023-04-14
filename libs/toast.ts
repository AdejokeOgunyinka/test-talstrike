import toast from "react-hot-toast";

const notify = ({ type, text }: { type: string; text: string }) => {
  switch (type) {
    case "success":
      toast.success(text);
      break;
    case "error":
      toast.error(text);
      break;
    default:
      break;
  }
};

export default notify;
