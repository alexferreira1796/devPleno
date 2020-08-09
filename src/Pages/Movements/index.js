import React, { useState, useEffect } from 'react'
import Rest from '../../utils/Rest'
import './styles.css'

const Header = () => {
  return (
    <>
      <div className="row mg-top20">
          <div className="col-md-12">
            <h1>Movimentações</h1>
          </div>
      </div>
    </>
  )
}

const baseURL = 'https://my-money-devpleno.firebaseio.com/'
const { useGet, usePost, useDelete, usePatch } = Rest(baseURL)

const Movements = ({ match }) => {

    // Funçao para renderizar trs da tabela
    // return dados formatados
    const renderTable = (data) => {
      let obj = data.data
      return Object.keys(obj).map(item => {
        return (
          <tr key={item}>
            <td>{obj[item].descricao}</td>
            <td>{obj[item].valor}</td>
            <td className="text-right">
              <button type="button" className="btn btn-danger" onClick={() => deleteKey(item)}>Excluir</button>
            </td>
          </tr>
        )
      })
    }

    const [validate, setValidate] = useState(false)
    const param = match.params.month
    const[id, setId] = useState(param)

    // Estado pelo parametro
    useEffect(() => {
      setId(param)
    }, [param] )

    const data = useGet(`movements/${id}`)
    const dataMonths = useGet(`months/${id}`)
    const [dataPost, post] = usePost(`movements/${id}`)
    const [dataDelete, doDelete] = useDelete()
    const [dataPatch, patch] = usePatch()

    var INIT_STATE = {
      add_value: 0,
      add_description: '',
      add_enter: 0,
      add_exit: 0
    }
    if(dataMonths.data) {
      INIT_STATE = {
        ...INIT_STATE,
        add_enter: dataMonths.data.previsao_entrada,
        add_exit: dataMonths.data.previsao_saida
      }
    }
    
    const [newValues, setValues] = useState(INIT_STATE)

    // Saved - Funcao asssincrona, espera uma retorna e seta valores iniciais
    // Expression Regular => No inicio, pode conter um traço 0 ou 1 vez, pode conter Digito 0 a inifinito, seguido de um ponto pode conter 0 ou 1 vez, seguido de um digito 0 ao infinito ou 0 ou 1 no final
    const saved = async () => {
      let value = newValues.add_value
      let description = newValues.add_description
      if(!isNaN(value) && value.search(/^[-]?\d+(\.)?\d+?$/) >= 0 ) {
        setValidate(false)
        await post({
          descricao: description,
          valor: value
        })
        setValues({
          ...INIT_STATE
        })
        data.refetch() // Refresh in page
        dataMonths.refetch()
      } else {
        setValidate(true)
      }
    }

    // Funcao generica para mudar os valores dos campos de input
    // Form Controlado
    const onChangeValues = field => event => {
      setValues({
        ...newValues,
        [field]: event.target.value
      })
    }
    
    // Register Delete
    const deleteKey = async(key) => {
      await doDelete(`movements/${id}/${key}`)
      data.refetch()
      dataMonths.refetch()
    }

    // Atualizar previsoes
    const update = () => {
      patch(
        `months/${id}`,
        {
          previsao_entrada: newValues.add_enter,
          previsao_saida: newValues.add_exit
        }
      )
      setTimeout(() => {
        dataMonths.refetch()
      }, 2000)
    }


    if(!data.data) {
      return (
        <div className="container">
          <Header />
          <div className="row mg-top20">
            <div className="col-sm-12">
              <hr />
              <form>
                <div className="form-row">
                  <div className="col">
                    <label htmlFor="add_description">Descrição</label>
                    <input type="text" name="add_description" value={newValues.add_description} className="form-control" id="add_description" onChange={onChangeValues("add_description")} />
                  </div>
                  <div className="col">
                      <label htmlFor="add_value">Valor</label>
                      <div className="input-group">
                        <input type="text" name="add_value" value={newValues.add_value} className="form-control" id="add_value" onChange={onChangeValues('add_value')} />
                        <div className="input-group-append">
                          <span className="input-group-text">R$</span>
                          <span className="input-group-text">{newValues.add_value}</span>
                        </div>
                      </div>
                  </div>
                  <div className="col">
                    <label htmlFor="saved">&nbsp;</label>
                    <button type="button" id="saved" className="btn btn-success form-control" onClick={() => saved()}>Salvar</button>
                  </div>
                </div>
                {
                  validate && 
                  <div className="form-row mg-top20">
                    <div className="col">
                      <div className="alert alert-danger" role="alert">
                          Valores inválidos
                      </div>
                    </div>
                  </div>
                }
              </form>
            </div>
          </div>
        </div>
      )
    }
    if(data.data) {
      if( Object.keys(data.data).length <= 0 ) {
          return (
            <div className="container">
              <Header />
              <div className="row mg-top20">
                  <div className="col-sm-12"> 
                      <div className="alert alert-warning" role="alert">
                          Carregando...
                      </div>
                  </div>
              </div>
            </div>
          )
      }

      return (
          <div className="container">
            <Header />
            {
               dataMonths.data &&
               <>
                 <br />
                 <p>
                   <strong>Previsão de Entrada:</strong> { dataMonths.data.previsao_entrada > 0 ? `R$ ${dataMonths.data.previsao_entrada}` : 0 }  /  <strong>Previsão de Saída:</strong> { dataMonths.data.previsao_saida !== null && dataMonths.data.previsao_saida !== 0  ? `R$ ${dataMonths.data.previsao_saida}` : 0 }
                 </p>
                 <p>
                   <strong>Entrada:</strong> { dataMonths.data.entradas > 0 ? `R$ ${dataMonths.data.entradas}` : 0 } / <strong>Saída:</strong> { dataMonths.data.saidas !== null && dataMonths.data.saidas !== 0 ? `R$ ${dataMonths.data.saidas}` : 0 }
                 </p>
               </>
            }
            <div className="row mg-top20">
              <div className="col-sm-12">
                  <table className="table">
                    <thead>
                        <tr>
                          <th>Descrição</th>
                          <th>Valor</th>
                          <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                      { !data.loading && renderTable(data) }
                    </tbody>
                  </table>
              </div>
            </div> 
            <div className="row">
              <div className="col-sm-12">
                <hr />
                <form>
                  <div className="form-row">
                    <div className="col">
                      <label htmlFor="add_description">Descrição</label>
                      <input type="text" name="add_description" value={newValues.add_description} className="form-control" id="add_description" onChange={onChangeValues("add_description")} />
                    </div>
                    <div className="col">
                        <label htmlFor="add_value">Valor</label>
                        <div className="input-group">
                          <input type="text" name="add_value" value={newValues.add_value} className="form-control" id="add_value" onChange={onChangeValues('add_value')} />
                          <div className="input-group-append">
                            <span className="input-group-text">R$</span>
                            <span className="input-group-text">{newValues.add_value}</span>
                          </div>
                        </div>
                    </div>
                    <div className="col">
                      <label htmlFor="saved">&nbsp;</label>
                      <button type="button" id="saved" className="btn btn-success form-control" onClick={() => saved()}>Salvar</button>
                    </div>
                  </div>
                  {
                     !data.loading &&
                     <>
                       <hr />
                       <div className="form-row">
                         <div className="col">
                            <label htmlFor="add_enter">Previsão de entrada</label>
                            <div className="input-group">
                              <input type="text" name="add_enter" value={newValues.add_enter || ''} className="form-control" id="add_enter" onChange={onChangeValues('add_enter')} />
                              <div className="input-group-append">
                                <span className="input-group-text">R$</span>
                                <span className="input-group-text">{newValues.add_enter}</span>
                              </div>
                            </div>
                        </div>
                        <div className="col">
                            <label htmlFor="add_exit">Previsão de saída</label>
                            <div className="input-group">
                              <input type="text" name="add_exit" value={newValues.add_exit || ''} className="form-control" id="add_exit" onChange={onChangeValues('add_exit')} />
                              <div className="input-group-append">
                                <span className="input-group-text">R$</span>
                                <span className="input-group-text">{newValues.add_exit}</span>
                              </div>
                            </div>
                        </div>
                        <div className="col">
                          <label htmlFor="saved">&nbsp;</label>
                          <button type="button" id="saved" className="btn btn-success form-control" onClick={() => update()}>Atualizar</button>
                        </div>
                      </div>
                    </>
                  }
                  {
                    validate && 
                    <div className="form-row mg-top20">
                      <div className="col">
                        <div className="alert alert-danger" role="alert">
                            Valores inválidos
                        </div>
                      </div>
                    </div>
                  }
                </form>
              </div>
            </div>
            <br /><br />
          </div>
      )
    }
  }

export default Movements