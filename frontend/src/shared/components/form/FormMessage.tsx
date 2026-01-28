type FormMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: FormMessageProps) {
  return (
    <p className="text-red-600 text-sm bg-red-50 border-sm rounded-sm p-2 mt-2">
      {message}
    </p>
  );
}

export function SuccessMessage({ message }: FormMessageProps) {
  return (
    <p className="text-green-600 text-sm bg-green-50 border-sm rounded-sm p-2 mt-2">
      {message}
    </p>
  );
}


