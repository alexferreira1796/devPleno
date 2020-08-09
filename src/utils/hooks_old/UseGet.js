import { useReducer, useEffect } from 'react'
import axios from 'axios'

const reduce = (state, action) => {
    if(action.type === "SUCCESS") {
        return {
            ...state,
            type: action.type,
            loading: false,
            data: action.data
        }
    }
    return state
}

const UseGet = url => {
    const [data, dispatch] = useReducer(reduce, {
        type: 'REQUEST',
        loading: true,
        data: {}
    })
    useEffect(() => {
        axios.get(url).then(res => {
            if(res.status === 200) {
                dispatch({
                    type: 'SUCCESS',
                    loading: false,
                    data: res.data
                })   
            }
        })
    }, [url])
    return data
}

export default UseGet

