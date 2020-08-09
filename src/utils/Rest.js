import { useEffect, useReducer } from 'react'
import axios from 'axios'

// Contantes com valores inicias dos reducers
const INIT_STATE = {
    loading: true,
    removing: false,
    data: {}
}
// Função reducer
const reduce = (state, action) => {
    if(action.type === "REQUEST") {
        return {
            ...state,
            data: {}
        }
    }
    if(action.type === "SUCCESS") {
        return {
            ...state,
            loading: false,
            data: action.data,
            removing: action.removing
        }
    }
    return state
}

const init = baseURL => {
    const initBase = resource => baseURL + resource + '.json'
    // GET
    const useGet = resource => {
        let base = initBase(resource)
        const [data, dispatch] = useReducer(reduce, INIT_STATE)
        const loading = async() => {
            dispatch({
                type: "REQUEST",
                loading: true,
                data: {}
            })
            const res = await axios.get( base )
            dispatch({
                type: 'SUCCESS',
                loading: false,
                data: res.data
            })
        }
        useEffect(() => {
            loading()
        }, [ base ])
        return {
            ...data,
            refetch: loading
        }
    }

    // POST
    const usePost = resource => {
        const[data, dispatch] = useReducer(reduce, INIT_STATE)
        const post = async (data) => {
            dispatch({
                type: 'REQUEST',
                loading: false
            })
            const res = await axios.post( initBase(resource), data )
            dispatch({
                type: "SUCCESS",
                data: res.data
            })
        }
        return [data, post]
    }

    // DELETE 
    const useDelete = () => {
        const[data, dispatch] = useReducer(reduce, INIT_STATE)
        const doRemove = async (resource) => {
            await axios.delete( initBase(resource) )
            dispatch({
                type: "SUCCESS",
                removing: true
            })
        }
        return [data, doRemove]
    }

    // PATCH 
    const usePatch = () => {
        const[data, dispatch] = useReducer(reduce, INIT_STATE)
        const patch = async (resource, data) => {
            await axios.patch( initBase(resource), data )
            dispatch({
                type: "SUCCESS",
                removing: true
            })
        }
        return [data, patch]
    }

    return {
        useGet,
        usePost,
        useDelete,
        usePatch
    }
}

export default init