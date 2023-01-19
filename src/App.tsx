import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { CommentCard } from './comment-card';
import axios from 'axios'
import { CommentList } from './CommentList';
import { io } from 'socket.io-client';

export interface IComment {
  _id: string,
  isDeleted: boolean,
  mentions: any,
  replies: any,
  message: string,
  type: string,
  module: string,
  createdDate: string,
  updatedDate: string,
  seenBy?: string[]
}

function App() {
  const userId = '1'
  const socket: any = useRef(null);
  const [alreadyPopulated, setAlreadyPopulated] = useState<boolean>(false)
  const [comments, setComments] = useState<IComment[]>([])
  const getComments = async () => {
    const res = await axios.get('http://localhost:3001/get-comments').then(res => res.data).catch(e => {
      console.log('axios err', e)
      return []
    })
    setComments(res)
  }

  const stopAndReconnectSocket = () => {
    if (socket.current != null) {
      socket.current.off('connect');
      socket.current.off('disconnect');
      socket.current.off('update');
      socket.current.close()
    }

    socket.current = io('http://localhost:3001', {
      query: {
        userId: userId
      }
    });


    socket.current.on('connect', () => {
      console.log('on-connect')
    });

    socket.current.on('disconnect', () => {
      console.log('on-disconnect')
    });

    socket.current.on('update', () => {
      console.log('on-update')
      getComments()
    });

    console.log('setting up socket', socket.current.connected)

  }

  const setUpdateAlreadyPopulated = (b: boolean) => {
    setAlreadyPopulated(b)
  }

  const populateUnreadMessages = () => {
    const unreads = comments.filter((c: IComment) => !Boolean(c.seenBy) || (c.seenBy && c.seenBy.find(id => id == userId) == undefined)).map((c: IComment) => ({ _id: c._id }))
    console.log('here is the unreads:', unreads)
    setSeenArray(unreads)
  }

  const setSeenArray = (ids: { _id: string }[]) => {
    if (socket.current != null) {
      console.log('setSeenArray', ids)
      socket.current.emit('setSeenArray', JSON.stringify(ids))
    }
  }


  useEffect(() => {
    stopAndReconnectSocket()
    getComments()
  }, [])

  useEffect(() => {
    if (alreadyPopulated) {
      console.log('Callback pop:', alreadyPopulated)
      populateUnreadMessages()
    }
  }, [alreadyPopulated])


  return (
    <div>
      <div className="App">
        <header className="App-header">

          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <p>
            Example big component here
          </p>
          <button onClick={stopAndReconnectSocket}>
            Connect with user id {userId}
          </button>
        </header>
      </div>
      <h3>Beginning of the comment section</h3>
      {
        alreadyPopulated ? <p>TRUE</p> : <p>FALSE</p>
      }
      <textarea />
      <CommentList comments={comments} setAlreadyPopulated={setUpdateAlreadyPopulated} isAlreadyPopulated={alreadyPopulated} userId={userId} />
    </div>

  );
}

export default App;
