import { useReducer } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    if(action.type === "SUCCESS") {
        return {
            ...state,
            type: action.type,
            loading: true,
            data: action.data
        }
    }
    return state
}

const useDelete = () => {
    const[data, dispatch] = useReducer(reducer, {
        loading: false,
        data: {}
    })
    const doRemove = url => {
        axios.delete(url)
        .then(() => {
            dispatch({
                type: "SUCCESS"
            })
        })
    }
    return [data, doRemove]
}

export default useDelete