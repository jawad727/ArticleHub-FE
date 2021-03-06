import React, {Component} from 'react';
import {connect} from "react-redux"
import { fetchComments, postComment, fetchLikes, postLike, deletePost } from "../../store/actions/index"
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
    loading: true,
    commentLoader: false
  }

  baseURL = "https://u242fne979.execute-api.us-east-1.amazonaws.com/dev"

  searcher = (term) => {
    var f = false;
    this.props.likesArray.forEach(item => {
      if (item["postid"] == term) {
        f = true
      }
    })
    return f
  }

  componentDidMount() {
    this.props.fetchComments(this.props.content.uid)
    Auth.currentSession().then((user) => {
      this.setState({
        username: user.accessToken.payload.username
      }) 
      this.props.fetchLikes(user.accessToken.payload.username).then(() => {
        this.setState({isLiked: this.searcher(this.props.content.uid), loading: false })
      })
  }) 
    .catch((err) => {
      console.log(err);
      this.setState({isLiked: false, loading: false })
    } )
  }


  changeHandler = (e) => {
    this.setState({ [e.target.name] : e.target.value });
  }


  upvote = (e) => {
    e.preventDefault();
    this.setState({likesnumber: this.state.likesnumber + 1, isLiked: true});
    this.props.postLike({postid: this.props.content.uid, userid: this.state.username});
    axios.put(`${this.baseURL}/post/${this.props.content.uid}`, {
      paramName: "PostLikes",
      paramValue: this.props.content.PostLikes + 1
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  viewed = (e) => {
    axios.put(`${this.baseURL}/post/${this.props.content.uid}`, {
      paramName: "PostLikes",
      paramValue: this.props.content.PostLikes + 1
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  alarmFunction = () => {

  if (window.confirm("Are you sure you want to delete this post? Changes cannot be reverted.")) {
              this.props.deletePost(this.props.content.uid)
            .then(() => {
              this.props.history.push("/home")
              console.log("post deleted");
            })
            .catch(function(error) {
              console.log(error);
            })
  } else {
    console.log("canceled")
  } }

  postCommentHandler = (e) => {
    e.preventDefault(); 
    this.setState({commentLoader: true}); 
    this.props.postComment({ 
      postid: this.state.postid, 
      text: this.state.text, 
      username: this.state.username })
    .then(() => this.setState({commentLoader: false, text: ""}))
    
  }


  render() {

    console.log(this.props.postComments)
    console.log("asd")

      return (
        <>
        {   this.state.loading || !this.props.commentFetched ? 
        
        <div className="spinnerContainer"> 
        <i class="fas fa-spinner fa-3x"></i> 
        </div> :

        <div className="backgroundPostContainer">
            <h1> {this.state.isLiked ? " [SEEN]" : null} {this.props.content.PostName} </h1>
           <div className="singlePostContainer" >
                <a target="_blank" href={this.props.content.SiteURL}>
                    <div onClick={(e) => {this.viewed(e); this.setState({likesnumber: this.state.likesnumber + 1}) }} className="singlePostImage" style={{ backgroundImage: `url(${this.props.content.PostImage})`}}>
                      <p className="ClickView">Click To View</p>
                    </div>
                </a>
                <div className="singlePostContent">
                    <h3 onClick={() => {this.props.history.push(`/${this.props.content.Username}`)}}>
                      {this.props.content.Username}
                    </h3>
      
                    { this.state.commentLoader ? 

                    <div className="spinnerContainerComments">
                    <i class="fas fa-circle-notch fa-2x"></i>
                    <p>Loading...</p>
                    </div>
                    
                    :

                    <div className="commentsArea" >
                        { this.props.postComments.map(item => {
                            return <p> <strong onClick={() => {this.props.history.push(`/${item.username}`)}}> {`${item.username}:`} </strong> {`${item.text}`} </p>
                        }) }
                    </div> }

                    <div className="contentLowerHalf" >
                        <div className="likeCommentDiv" >
                            { this.state.isLiked ? <i class="fas fa-eye fa-2x" style={{color: "grey"}}></i>
                            : <i class="far fa-eye fa-2x" onClick={(e) => this.state.username.length == 0 ? alert(`Log in to mark post as "Viewed"`)  : this.upvote(e) } ></i> }
                              <i class="far fa-comment fa-2x" ></i>
                            { this.props.content.Username == this.state.username ?
                              <i class="fas fa-trash-alt fa-2x trashicon" onClick={() => { this.alarmFunction() }}></i> 
                            : null}
                        </div>
                        <p className="amountOfLikes">{`${this.state.likesnumber} views`}</p>
                        <img src="" /><p className="displaynameText" ><strong className="strongName" onClick={() => {this.props.history.push(`/${this.props.content.Username}`)}}>{ `${this.props.content.Username}:`}</strong> {`${this.props.content.PostDescription}`}</p>
                        <form onSubmit={(e) => {this.postCommentHandler(e)}}>
                            <input onClick={() => {this.state.username.length == 0 ? alert("Log in before making a comment.") : console.log("") }} onChange={(e) => {this.state.username.length == 0 ? e.target.value = "" : this.changeHandler(e) }} type="text" placeholder="add a comment" rows="2" name="text" value={this.state.text} />
                            
                        </form>
                    </div>
                    
                    
                </div>
                
           </div>
           <button className="goBackButton" onClick={() => this.props.history.goBack()}>Go Back</button>
        </div>
          }
        </>
        )
  }
}
 
const mapStateToProps = state => ({

    postComments: state.postComments,
    likesArray: state.likesArray,
    commentFetched: state.commentFetched
})

export default connect(mapStateToProps, {fetchComments, postComment, fetchLikes, postLike, deletePost} )(PostPage);