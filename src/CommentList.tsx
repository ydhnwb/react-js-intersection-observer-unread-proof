import React, { useEffect, useState } from 'react'
import { IComment } from './App'
import { CommentCard } from './comment-card'

interface IProps {
    comments: IComment[]
    setAlreadyPopulated: (b: boolean) => void
    isAlreadyPopulated: boolean
    userId: string
}

export function CommentList({
    comments,
    setAlreadyPopulated,
    isAlreadyPopulated,
    userId
}: IProps) {
    const [_firstUnreadItem, _setFirstUnreadItem] = useState<IComment | undefined>()

    useEffect(() => {
        if (isAlreadyPopulated) {
            _setFirstUnreadItem(undefined)
        }
    }, [isAlreadyPopulated])

    useEffect(() => {
        if (isAlreadyPopulated) {
            _setFirstUnreadItem(undefined)
        } else {
            _setFirstUnreadItem((prev) => {
                const x = comments.find((c: IComment) => !c.seenBy || (c.seenBy && c.seenBy.find(id => id == userId) == undefined))
                return x
            })
        }

    }, [comments])
    return <>
        {
            comments.map((c: IComment) => {
                return <CommentCard setAlreadyPopulated={setAlreadyPopulated} comment={c} firstUnreadItem={_firstUnreadItem} userId={userId} />
            })
        }
    </>
}