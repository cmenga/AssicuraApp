type FormHeaderProps = {
  title: string;
  description: string;
};

export function FormHeader(props: FormHeaderProps) {
  const { title, description } = props;
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
