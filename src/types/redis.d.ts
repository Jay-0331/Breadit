import { VoteType } from "@prisma/client"

export type CachePost = {
    id: string
    title: string
    authorUsername: string
    content: string
    currentVote: VoteType | undefined
    createdAt: Date
}