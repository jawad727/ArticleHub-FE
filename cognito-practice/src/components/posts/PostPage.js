import React, {Component} from 'react';
import {connect} from "react-redux"
import { fetchComments, postComment, fetchLikes, postLike } from "../../store/actions/index"
import {Auth} from "aws-amplify";
import axios from 'axios'

const params = {
  id: "itworked",
  userid: "testuser25"
}

class PostPage extends Component {
  state = {
    text: "",
    postid: this.props.content.uid,
    username: "",
    likesnumber: this.props.content.PostLikes,
    isLiked: false,
    loading: true
  }

  searcher = (term) => {
    var f = false;
    this.props.likesArray.forEach(item => {
      if (item["id"] == term) {
        f = true
      }
    })
    return f
  }

  componentDidMount() {
    this.props.fetchComments(this.props.content.uid)
    Auth.currentSession().then((user) => {
      this.setState({username: user.accessToken.payload.username}) 
      this.props.fetchLikes(user.accessToken.payload.username).then(() => {
        this.setState({isLiked: this.searcher(this.props.content.uid), loading: false })
      })
  }) 
    .catch((err) => {console.log(err)} )
  }



  changeHandler = (e) => {
    this.setState({ [e.target.name] : e.target.value });
  }

  baseURL = "https://u242fne979.execute-api.us-east-1.amazonaws.com/dev"

  upvote = (e) => {
    e.preventDefault();
    this.setState({likesnumber: this.state.likesnumber + 1, isLiked: true});
    this.props.postLike({id: this.props.content.uid, userid: this.state.username});
    axios.put(`${this.baseURL}/post/${this.props.content.uid}`, {
      paramName: "PostLikes",
      paramValue: this.props.content.PostLikes + 1
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

  // makeRead = (e) => {
  //   e.preventDefault();
    
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))
  // }

  

  render() {

    console.log(this.props.likesArray)
    console.log(this.props.content.uid)
    // console.log(this.state)
    // console.log(this.state)

      return (
        <div className="backgroundPostContainer">
            <h1>{this.props.content.PostName}</h1>
           <div className="singlePostContainer" >
                <a target="_blank" href={this.props.content.SiteURL}>
                    <div className="singlePostImage" style={{ backgroundImage: `url(${this.props.content.PostImage})`}} />
                </a>
                <div className="singlePostContent">
                    <h3>{this.props.content.Username}</h3>
                    <div className="commentsArea" >
                        { this.props.postComments.map(item => {
                            return <p> <strong> {`${item.username}:`} </strong> {`${item.text}`} </p>
                        }) }
                    </div>
                    <div className="contentLowerHalf" >
                        <div className="likeCommentDiv" >
                            { this.state.isLiked ? <i class="fas fa-eye fa-2x" style={{color: "grey"}}></i>
                            : <i class="far fa-eye fa-2x" onClick={this.upvote}></i> }
                              <i class="far fa-comment fa-2x" ></i>
                        </div>
                        <p className="amountOfLikes">{`${this.state.likesnumber} Reads`}</p>
                        <p className="displaynameText" ><strong>{ `${this.props.content.Username}:`}</strong> {`${this.props.content.PostDescription}`}</p>
                        <form onSubmit={(e) => {e.preventDefault(); this.props.postComment(this.state)} }>
                            <input name="text" onChange={this.changeHandler} type="text" placeholder="add a comment" rows="2" />
                            
                        </form>
                    </div>
                    
                </div>
           </div>
        </div>
        )
  }
}
 
const mapStateToProps = state => ({

    postComments: state.postComments,
    likesArray: state.likesArray
})

export default connect(mapStateToProps, {fetchComments, postComment, fetchLikes, postLike} )(PostPage);

// export default PostPage

// fetchComments