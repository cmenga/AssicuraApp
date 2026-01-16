type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="text-red-600 text-sm bg-red-50 border-sm rounded-sm p-2 mt-2">
      {message}
    </p>
  );
}
