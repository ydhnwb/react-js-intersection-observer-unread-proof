import { IComment } from "./App";
import { InView } from 'react-intersection-observer';


interface ICommentCardProps {
    comment: IComment,
    setAlreadyPopulated: (b: boolean) => void
    firstUnreadItem?: IComment | undefined
    userId: string
}

export function CommentCard({ comment, setAlreadyPopulated, firstUnreadItem, userId }: ICommentCardProps) {
    const checkIsUnread = () => {
        if (!comment.seenBy) {
            return true
        }

        const alreadyRead = comment.seenBy.find((id: string) => id == userId)
        if (!alreadyRead) {
            return true
        }
        return false
    }

    return (
        <InView as="div" delay={3000} threshold={0.7} onChange={(inView, entry) => {
            console.log('Inview:' + comment._id, inView)
            if (inView && checkIsUnread()) {
                setAlreadyPopulated(inView)
            }
        }} triggerOnce={true}>
            <>
                {
                    firstUnreadItem && firstUnreadItem._id == comment._id && <h4>---- UNREAD -----</h4>
                }
                <div className="styleCard">
                    <div className="styleCardContent">
                        <p className="styleCardTitle">ID: {comment._id}</p>
                        <p className="styleDescription">MSG: {comment.message}</p>
                    </div>
                </div>
            </>

        </InView>
    );
}