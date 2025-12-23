import { useControllerStore } from "@/store/controller.store";
import { ArrowBigLeft } from "lucide-react"

const ChatboxExpandButton = () => {
    const toggleChatbox = useControllerStore((state) => state.toggleChatbox);
    return (
        <div className="w-[2rem] max-w-[2rem] h-full flex flex-col items-center justify-start mt-4 gap-2">
            <button
                type="button"
                onClick={toggleChatbox}
                aria-label="Expand chatbox"
                className="p-1 rounded "
            >
                <ArrowBigLeft />
            </button>
            <span
                className="text-[10px] font-medium text-gray-600 select-none tracking-widest"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
                CHATBOX
            </span>
        </div>
    )
}

export default ChatboxExpandButton