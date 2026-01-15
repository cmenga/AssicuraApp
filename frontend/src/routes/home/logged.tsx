import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/home/logged')({
  component: RouteComponent,
  beforeLoad: () => {
    const jwtAccess = sessionStorage.getItem("jwt_access");
    if (!jwtAccess)
      throw redirect({ to: "/home" }) 
  }
})

function RouteComponent() {
  return <div>Hello "/home/logged"!</div>
}
