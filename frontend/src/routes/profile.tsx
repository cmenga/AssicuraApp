import ProfileNavigation from '@/features/profile/components/navigation/ProfileNavigation';
import ProfilePage from '@/features/profile/Profile';
import { userApi } from '@/shared/api/user.service';

import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
  loader: loader
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return <div className="min-h-screen bg-gray-50">
    <ProfileNavigation />
    <ProfilePage user={data.user} addresses={data.addresses} />
  </div>;

}

async function loader() {
  const sessionUser = sessionStorage.getItem("user_data");
  if (!sessionUser) throw redirect({ to: '/home' });
  const user = JSON.parse(sessionUser);

  const addressesStorage = sessionStorage.getItem("addresses_data");
  if (!addressesStorage) {
    const response = await userApi.get("/addresses");
    sessionStorage.setItem("addresses_data", JSON.stringify(response.data));
    return { user: user, addresses: response.data };
  }

  const sessionAddresses = JSON.parse(addressesStorage);
  return { user: user, addresses: sessionAddresses };
}
