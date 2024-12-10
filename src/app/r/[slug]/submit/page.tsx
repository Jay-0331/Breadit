import Editor from "@/components/Editor"
import { Button } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ slug: string }>
}

const page = async ({ params }: PageProps) => {
    const { slug } = await params

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug,
        },
    })

    if(!subreddit) return notFound()

    return <div className="flex flex-col items-start gap-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
            <div className="-ml-2 -my-2 flex flex-wrap items-baseline">
                <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                    Create Post
                </h3>
                <p className="ml-2 mt-1 truncate text-sm text-gray-600 dark:text-gray-400">in r/{slug}</p>
            </div>
        </div>

        {/* form */}
        <Editor subredditId={subreddit.id}/>


        <div className="w-full flex justify-end">
            <Button type='submit' className="w-full" form="subreddit-post-form">Post</Button>
        </div>
    </div>
}

export default page