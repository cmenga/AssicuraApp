import ChangePassword from "./ChangePassword";
import Contacts from "./Contacts";

type CredentialsProps = {
    email: string;
    phoneNumber: string;
};
export default function Credentials({email,phoneNumber}: CredentialsProps) {
    return (
        <div className="flex flex-col gap-6">
            <Contacts email={email} phoneNumber={phoneNumber} />
            <ChangePassword />
        </div>
    );
}