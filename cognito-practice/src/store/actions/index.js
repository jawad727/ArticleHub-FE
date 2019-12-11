import axios from 'axios'

export const FETCH_USERS = "FETCH_USERS"
export const POST_USER = "POST_USER"
export const FETCH_POSTS = "FETCH_POSTS"
export const MAKE_POST = "MAKE_POST"

const baseURL = "https://u242fne979.execute-api.us-east-1.amazonaws.com/dev"

export const fetchUsers = () => dispatch => {
    return axios.get(`${baseURL}/users`)
    .then(res => {
        dispatch({
            type: FETCH_USERS,
            payload: res.data
        })
    }).catch(err => {
        console.log(err)
    })
}

export const postUser = (user) => dispatch => {
    return axios.post(`${baseURL}/user`, user)
    .then(res => {
        dispatch({
            type: POST_USER,
            payload: res.data
        })
    })
    .catch(err => {
        console.log(err)
    })
}

export const fetchPosts = () => dispatch => {
    return axios.get(`${baseURL}/posts`)
    .then(res => {
        dispatch({
            type: FETCH_POSTS,
            payload: res.data
        })
    }).catch(err => {
        console.log(err)
    })
}

export const makePost = (post) => dispatch => {
    return axios.post(`${baseURL}/post`, post)
    .then(res => {
        dispatch({
            type: MAKE_POST,
            payload: res.data
        })
    })
    .catch(err => {
        console.log(err)
    })
}