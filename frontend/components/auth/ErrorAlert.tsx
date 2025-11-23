interface ErrorAlertProps {
    message: string;
}

/**
 * Error alert for form errors
 */
export function ErrorAlert({ message }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-lg mb-6 text-sm">
            {message}
        </div>
    );
}