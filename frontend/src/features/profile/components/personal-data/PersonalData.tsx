import type { AddressModel, UserModel } from "@/shared/type";
import Anagraphic from "./Anagraphic";
import Contacts from "./Contacts";
import Address from "./Address";

type PersonalDataProps = {
  user: UserModel;
  address: AddressModel;
};

export default function PersonalData({ user, address }: PersonalDataProps) {
  return (
    <div className="space-y-6">
      <Anagraphic user={user} />

      <div className="grid md:grid-cols-2 gap-2">
        <Contacts email={user.email} phoneNumber={user.phone_number} />
        <Address address={address} />
      </div>
    </div>
  );
}
