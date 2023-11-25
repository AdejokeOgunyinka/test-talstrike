import EmojiPicker, {EmojiClickData, Theme } from 'emoji-picker-react';



export const NewEmojiPicker=({ onClick, onEmojiSelect }: { onClick: ()=> void, onEmojiSelect: (emojiData: EmojiClickData, event: MouseEvent)=> void }) => {
   
    
    return (
      <div  className={`absolute inset-0 flex justify-center items-center z-10`} onClick={onClick} >
        <div className={`z-40`}>
          <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiSelect}  />
        </div>
        
      </div>
    );
  }