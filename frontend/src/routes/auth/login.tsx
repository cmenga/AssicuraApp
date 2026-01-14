

import { LoginDescription } from '@/components/auth-login/LoginDescription';
import { LoginForm } from '@/components/auth-login/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
      <LoginDescription />
      <LoginForm />
    </div>
  );
}
