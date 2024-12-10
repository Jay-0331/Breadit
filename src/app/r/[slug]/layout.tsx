import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle"
import { buttonVariants } from "@/components/ui/Button"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"

type LayoutProps = {
    children: React.ReactNode
    params: {
        slug: string
    }
}

const Layout = async ({
    children,
    params: { slug }
}: LayoutProps) => {
    const session = await getAuthSession()
    const subreddit = await db.subreddit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true
                },

                take: INFINITE_SCROLLING_PAGINATION_RESULTS
            },
        },
    })

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where: {
            subreddit: {
                name: slug,
            },
            user: {
                id: session.user.id,
            },
        },
    })

    const isSubscribed = !!subscription

    const memberCount = await db.subscription.count({
        where: {
            subreddit: {
                name:slug,
            },
        },
    })

    if (!subreddit) return notFound()

    return <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div>
                {/* TODO: Button to take us back */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">
                        { children }
                    </div>

                    {/* info sidebar */}
                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-zinc-200 dark:border-zinc-800 order-first md:order-last">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">About r/{subreddit.name}</p>
                        </div>

                        <dl className="divide-y divide-zinc-100 dark:divide-zinc-800 px-6 py-4 text-sm leading-6 bg-white dark:bg-black">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-600 dark:text-gray-400">Created</dt>
                                <dd className="text-gray-700 dark:text-gray-300 font-medium">
                                    <time dateTime={subreddit.createdAt.toDateString()}>
                                        {format(subreddit.createdAt, 'MMMM d yyyy')}
                                    </time>
                                </dd>
                            </div>

                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-600 dark:text-gray-400">Members</dt>
                                <dd className="text-gray-700 dark:text-gray-300 font-medium">
                                    { memberCount }
                                </dd>
                            </div>

                            {subreddit.creatorId === session?.user.id ? (
                                <div className="flex justify-between gap-x-4 py-3">
                                    <p className="text-gray-600 dark:text-gray-400">You created this community</p>
                                </div>
                            ): null}
                            
                            { subreddit.creatorId !== session?.user.id ? (
                                <div className="pt-3">
                                    <SubscribeLeaveToggle subredditId={subreddit.id} subredditName={subreddit.name} isSubscribed={isSubscribed}/>
                                </div>
                            ) : null}
                            
                            <div className="border-none">
                                <Link href={`r/${slug}/submit`} className={buttonVariants({
                                    variant: 'outline',
                                    className: 'w-full mb-6'
                                })}>Create Post</Link>
                            </div>
                        </dl>
                    </div>
                </div>

            </div>
        </div>
}

export default Layout