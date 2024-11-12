import { useQuery } from '@apollo/client';
import React from 'react'
import { GET_POSTS } from '../../Query/getPosts';
import { Link } from 'react-router-dom';

const Posts = () => {
    // const { loading, error, data } = useQuery(GET_POSTS);
    

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="posts">
            <div className='container'>
                <div className="posts_wrap">
                    <h2 className="title-md cl-pri t-center fw-7">List Post</h2>
                </div>
            </div>

        </div>
    )
}

export default Posts