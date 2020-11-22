import React from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";

function Post() {
    return (
        <div className="post">
            <h3>Username</h3>
            <img className="post__image" src="https://www.freecodecamp.org/news/content/images/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png"></img>

            <h4 className="post__text"><strong>aahadpatel</strong> default caption</h4>
        </div>
    )
}

export default Post;