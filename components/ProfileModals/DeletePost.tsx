import ModalContainer from "@/components/Modal";
import BeatLoader from "react-spinners/BeatLoader";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePost } from "@/api/profile";
import notify from "@/libs/toast";

const DeletePost = ({
  id,
  postType,
  onClose,
}: {
  id: string;
  postType: string;
  onClose: () => void;
}) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const queryClient = useQueryClient();

  const { mutate, isLoading: isDeleting } = useDeletePost();
  return (
    <ModalContainer>
      <div className=" w-[90%] md:w-[500px] bg-brand-500 h-[250px] rounded-[6px] p-[20px] relative">
        <h2 className="text-[20px] font-medium mt-[50px] text-center">
          Are you sure you want to delete this {postType}?
        </h2>
        <div className="flex w-[90%] justify-center gap-x-[20px] absolute bottom-[30px]">
          <button
            className="w-[120px] h-[48px] rounded-[4px] border border-brand-1850"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-[120px] h-[48px] rounded-[4px] bg-brand-warning text-brand-500"
            onClick={() => {
              mutate(
                { postId: id, token: TOKEN as string },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries(["getMyPosts"]);
                    queryClient.invalidateQueries(["getMyPostsByType"]);
                    onClose();
                  },
                  onError: (err: any) => {
                    notify({
                      type: "error",
                      text: err?.body || err?.data?.message,
                    });
                  },
                }
              );
            }}
          >
            {isDeleting ? (
              <BeatLoader
                color={"white"}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default DeletePost;
