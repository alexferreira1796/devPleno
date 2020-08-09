import React from 'react'
import { Link } from 'react-router-dom'
import Rest from '../../../../utils/Rest'

const baseURL = 'https://my-money-devpleno.firebaseio.com/'
const { useGet } = Rest(baseURL)

const format = param => {
    param = param.toString()
    return param.replace(/^0+(?!\.|$)/, '')
}

// Funçao para renderizar trs da tabela
// return dados formatados
const renderTable = (data) => {
    let obj = data.data
    return Object.keys(obj).map(item => {
      return (
        <tr key={item}>
            <td>
            <Link to={`/movements/${item}`}>{item}</Link>
            </td>
            <td>{ obj[item].previsao_entrada }</td>
            <td>{ format(obj[item].entradas) }</td>
            <td>{ obj[item].previsao_saida }</td>
            <td>{ format(obj[item].saidas) }</td>
        </tr>
      )
    })
}

const Table = () => {
    const data = useGet('months')
    if(!data.data) {
        return (
            <div className="row mg-top20">
            <div className="col-sm-12"> 
                <hr />
                <div className="alert alert-danger" role="alert">
                    Nada encontrado!
                </div>
            </div>
        </div>
        )
    }
    if(data.data) {
        if( Object.keys(data.data).length <= 0 ) {
            return (
                <div className="row mg-top20">
                    <div className="col-sm-12"> 
                        <div className="alert alert-warning" role="alert">
                            Carregando...
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <>
            <div className="row mg-top20">
                <div className="col-sm-12">
                    <table className="table">
                    <thead>
                        <tr>
                        <th>Mês</th>
                        <th>Previsão de entrada</th>
                        <th>Entrada</th>
                        <th>Previsão saída</th>
                        <th>Saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        { !data.loading && renderTable(data) }
                    </tbody>
                    </table>
                </div>
                </div>  
            </>
        )
    }
}

export default Table