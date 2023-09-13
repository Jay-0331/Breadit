import { User } from 'next-auth'
import { FC } from 'react'
import { Avatar, AvatarFallback } from './ui/Avatar'
import Image from 'next/image'
import { AvatarProps } from '@radix-ui/react-avatar'
import { UserCircle } from 'lucide-react'

interface UserAvatarProps extends AvatarProps{
    user: Pick<User, 'name' | 'image'>
}

const UserAvatar: FC<UserAvatarProps> = ({user, ...props}) => {
    return (
        <Avatar {...props} >
            {user.image ? (
                <div  className='relative aspect-square h-full w-full'>
                    <Image 
                        fill 
                        src={user.image}
                        alt='profile picture'
                        referrerPolicy='no-referrer'
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className='sr-only'>{user.name}</span>
                    <UserCircle className='h-full w-full'/>
                </AvatarFallback>
            )}
        </Avatar>
    )
}

export default UserAvatar