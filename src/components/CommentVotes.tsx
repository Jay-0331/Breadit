'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { FC, useState } from 'react'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { CommentVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { Button } from './ui/Button'

type PartialVote = Pick<CommentVote, 'type'>

interface CommentVoteProps {
    commentId: string
    initialVoteAmt: number
    initialVote?: PartialVote
}

const CommentVotes: FC<CommentVoteProps> = ({
    commentId,
    initialVoteAmt,
    initialVote,
}) => {
    const { loginToast } = useCustomToast()
    const [voteAmt, setVoteAmt] = useState<number>(initialVoteAmt)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const prevVote = usePrevious(currentVote)


    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: CommentVoteRequest = {
                commentId,
                voteType,
            }

            await axios.patch('/api/subreddit/post/comment/vote', payload)
        },
        onError: (err, voteType) => {
            if(voteType === 'UP') setVoteAmt((prev) => prev - 1)
            else setVoteAmt((prev) => prev + 1)

            setCurrentVote(prevVote)

            if(err instanceof AxiosError) {
                if(err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong',
                description: 'Your vote was not registered. please try again.',
                variant: 'destructive'
            })
        },
        onMutate: (type) => {
            if(currentVote?.type === type) {
                setCurrentVote(undefined)
                if(type === 'UP') setVoteAmt((prev) => prev - 1)
                else if(type === 'DOWN') setVoteAmt((prev) => prev + 1)
            } else {
                setCurrentVote({ type })
                if(type === 'UP') setVoteAmt((prev) => prev + (currentVote ? 2 : 1))
                else if(type === 'DOWN') setVoteAmt((prev) => prev - (currentVote ? 2 : 1))
            }
        }

    })

    return <div className='flex gap-1 w-18'>
        <Button onClick={() => vote('UP')} size='sm' variant='ghost' aria-label='upvote' className='focus:ring-0 focus:ring-offset-0'>
            <ArrowBigUp className={cn('h-6 w-6 text-zinc-700 dark:text-zinc-300', {
                'text-emerald-500 dark:text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
            })}/>
        </Button>

        <p className='text-center py-2 font-medium text-sm text-zinc-900 dark:text-gray-100'>
            {voteAmt}
        </p>

        <Button onClick={() => vote('DOWN')} size='sm' variant='ghost' aria-label='downvote' className='focus:ring-0 focus:ring-offset-0'>
            <ArrowBigDown className={cn('h-6 w-6 text-zinc-700 dark:text-zinc-300', {
                'text-red-500 dark:text-red-500 fill-red-500': currentVote?.type === 'DOWN',
            })}/>
        </Button>
    </div>
}

export default CommentVotes