import CommentsSection from '@/components/CommentsSection'
import EditorOutput from '@/components/EditorOutput'
import PostVoteServer from '@/components/post-vote/PostVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { CachePost } from '@/types/redis'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'


interface PageProps {
    params: {
        postId: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const page = async ({params}: PageProps) => {
    
    const cachedPost = await redis.hgetall(`post:${params.postId}`) as CachePost

    let post: (Post & { votes: Vote[]; author: User}) | null = null

    if(!cachedPost) {
        post  = await db.post.findFirst({
            where: {
                id: params.postId,
            },
            include:  {
                votes: true,
                author: true,
            },
        })
    }

    if (!post && !cachedPost) return notFound()

    return (
        <div>
            <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
                <Suspense fallback={<PostVoteShell />}>
                    {/* @ts-expect-error server component */}
                    <PostVoteServer postId={post?.id ?? cachedPost.id} getData={async () => {
                        return await db.post.findUnique({
                            where: {
                                id: params.postId,
                            },
                            include: {
                                votes: true,
                            },
                        })
                    }}/>
                </Suspense>

                <div className='sm:w-0 w-full flex-1 bg-white dark:bg-black p-4 rounded-sm'>
                    <p className='max-h-40 mt-1 truncate text-xs'>
                        Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
                        {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                    </p>
                    <h1 className='text-xl font-semibold py-2 leading-6 text-zinc-900 dark:text-gray-100'>
                        {post?.title ?? cachedPost.title}
                    </h1>

                    <EditorOutput content={post?.content ?? cachedPost.content}/>

                    <Suspense fallback={<Loader2 className='h-5 w-5 animate-spin text-zinc-500'/>}>
                        {/* @ts-expect-error server component */}
                        <CommentsSection postId={post?.id ?? cachedPost.id}/>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

function PostVoteShell() {
    return <div className='flex flex-col items-center gap-1 pr-6 w-18'>
        <div className={buttonVariants({variant: 'ghost'})}>
            <ArrowBigUp className='h-7 w-7 text-zinc-700 dark:text-zinc-300'/>
        </div>

        <div className='text-center py-2 font-medium text-sm text-zinc-900 dark:text-gray-100'>
            <Loader2 className='h-4 w-4 animate-spin'/>
        </div>

        <div className={buttonVariants({variant: 'ghost'})}>
            <ArrowBigDown className='h-7 w-7 text-zinc-700 dark:text-zinc-300'/>
        </div>
    </div>
}

export default page