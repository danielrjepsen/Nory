interface ErrorAlertProps {
    message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className="bg-nory-white border-2 border-nory-black rounded-btn px-4 py-3 mb-6 flex items-start gap-3 shadow-brutal-sm">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <span className="text-body text-nory-black font-grotesk">{message}</span>
        </div>
    );
}