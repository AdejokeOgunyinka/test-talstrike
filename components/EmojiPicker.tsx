import EmojiPicker from 'emoji-picker-react';

export const NewEmojiPicker=({ onClose, onEmojiSelect, isOpen=false }: { onClose: () => void; onEmojiSelect: () => void; isOpen: boolean }) => {
    const hide=(isOpen)?"":"hidden"
    return (
      <div className={`${hide} absolute inset-0 flex justify-center items-center z-10`}>
        <EmojiPicker />
      </div>
    );
  }