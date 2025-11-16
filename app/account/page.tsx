import { LogOutButton } from "@/components/buttons/log-out-button";
import { GetAuthServerSession } from "@/utils/auth-option";
import Image from "next/image";

const AccountPage = async () => {

    const session = await GetAuthServerSession();
    return (
        <>
            <div>Bienvenu, {session?.user?.name}</div>
            <p>{session?.user?.email}</p>
            <Image width={100} height={100} src={session?.user?.image} alt={session?.user?.name} />
            <LogOutButton />
        </>
    )
}

export default AccountPage