import React, {Component} from 'react'
import {connect} from "react-redux"
import "./postform.css"
import Amplify, {Storage} from "aws-amplify"
import PostForm2 from "./PostForm2"
import {Auth} from "aws-amplify";


class PostForm extends Component {
      state = {
          username: "",
         fileUrl: "",
         file: "",
         filename: ""
      }


    //   Amplify.configure({
    //         Storage: {
    //             AWSS3: {
    //                 bucket: '' 
    //             }
    //         }
    //   })

    componentDidMount() {
        Auth.currentSession().then((ses) => {
            this.setState({username: ses.accessToken.payload.username})
        } ).catch((err) => {console.log(err)} )
    }


      handleChange = e => {
          const file = e.target.files[0]
          this.setState({
              fileUrl: URL.createObjectURL(file),
              file: file,
              filename: `${this.state.username}/${file.name}`
          })
          console.log(file)
      }
      
      saveFile = () => {
          Storage.put(this.state.filename, this.state.file)
          .then(() => {

              console.log("successfully saved file!", `${this.state.filename}`)

              Storage.get(`${this.state.filename}`).then(data => {

                  console.log("GETIMAGE WORKS!!!!")

                this.setState({
                    fileUrl: data
                })
            })
            //   this.setState({fileUrl: "", file: "", filename: ""})
          })
          .catch(err => {
              console.log("error uploading file", err)
          })
      }
    

    render() {

            console.log(this.state.fileUrl)
            console.log(this.state.username)

        return (
            <div className="PostFormPageContainer" >
                <div className="PostFormContainer" >
                    <div className="PostImageContainer">
                        <label>
                            <input className="hiddenInput" type="file"  onChange={this.handleChange} />
                            <span className="fileUploadSpan" >Upload Image</span>
                        </label>

                        <div className="form1image" style={{backgroundImage: `url(${this.state.fileUrl})`, backgroundSize: "cover"}} />
                        <p> (Make sure dimensions of image are equal or close) </p>
                        {this.state.fileUrl.length > 5 ? <button onClick={this.saveFile}> Confirm Image </button> : null}
                    </div>
                    <div className="PostContentContainer" >
                        <form>
                            <input />
                        </form>
                    </div>

                </div>
                {/* <div className="" style={{ width: "100px", height: "100px",  backgroundImage: `url(${this.state.fileUrl})`, backgroundSize: "cover"}} /> */}
              
            </div>
        );
    }
}

const mapStateToProps = state => ({
    
    
  })


export default connect(mapStateToProps, null)(PostForm);