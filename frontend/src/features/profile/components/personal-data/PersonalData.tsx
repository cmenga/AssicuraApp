import type { AddressModel, UserModel } from "@/shared/type";
import Anagraphic from "./Anagraphic";
import Address from "./Address";
import Credentials from "./Credentials";
import { useStoreKeyOrThrow } from "@/shared/hooks/useStoreKey";

type PersonalDataProps = {
  user: UserModel;
};

export default function PersonalData({ user }: PersonalDataProps) {
  const address = useStoreKeyOrThrow<AddressModel[]>("address")
  return (
    <div className="space-y-6">
      <Anagraphic user={user} />

      <div className="grid md:grid-cols-2 gap-2">
        <Credentials email={user.email} phoneNumber={user.phone_number} />
        <Address address={address[0]} />
      </div>
    </div>
  );
}
