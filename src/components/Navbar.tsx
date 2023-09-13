import Link from "next/link"
import { Icons } from "./Icons"
import { buttonVariants } from "./ui/Button"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "./UserAccountNav"
import { ModeToggle } from "./ModeToggle"
import SearchBar from "./SearchBar"

const Navbar = async () => {
    const session = await getAuthSession()

    return <div className="sticky top-0 inset-x-0 border-b backdrop-blur-lg border-zinc-300 dark:border-zinc-800 z-[10] py-2">
        <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
            {/* logo */}
            <Link href="/" className="flex gap-2 items-center">
                <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
                <p className="hidden text-zinc-800 dark:text-zinc-300 text-sm font-medium md:block">Breadit</p>
            </Link>

            {/* search bar */}
            <SearchBar />


            <div className="flex space-x-3 items-center">
                <ModeToggle />
                {session?.user ? ( 
                    <UserAccountNav user={session.user} />
                ) : (
                    <Link href='/sign-in' className={buttonVariants({ variant: 'default'})}>
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    </div>
}

export default Navbar