import { MessageCircle } from "lucide-react";

export default function ChatButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
        <MessageCircle className="size-4" />
        Chat with Adzyl
      </button>
    </div>
  );
}
