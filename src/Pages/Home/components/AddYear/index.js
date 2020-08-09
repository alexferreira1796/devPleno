import React, { useState, useRef } from 'react'
import { Redirect } from 'react-router-dom'

const AddYear = () => {

  const addZero = num => {
    if(num < 10) {
      return `0${num}`
    }
    return num
  }
  
  // Funçao para renderizar Option
  // @param init - inicio do loop
  // @param end - fim do loop
  const renderOptions = (init, end) => {
    let rows = []
    for(let i = init; i <= end; i++ ) {
      let num = addZero(i)
      rows.push(
        <option key={num}>{num}</option>
        )
    }
    return rows
  }

  const refYear = useRef()
  const refMonth = useRef()
  const[redir, setRedir] = useState('')

  const add_saved = () => {
    setRedir( `/movements/${refYear.current.value}-${refMonth.current.value}` )
  }

  if(redir !== '') {
    return <Redirect to={redir} />
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <form>
            <div className="form-row">
              <div className="col">
                <label htmlFor="add_year">Adicionar Ano</label>
                <select className="form-control" id="add_year" ref={refYear}>
                  { renderOptions(2020, 2030) }
                </select>
              </div>
              <div className="col">
                <label htmlFor="add_month">Adicionar Mês</label>
                <select className="form-control" id="add_month" ref={refMonth}>
                  { renderOptions(1, 12) }
                </select>
              </div>
              <div className="col">
                <label htmlFor="add_month">&nbsp;</label>
                <button type="button" className="btn btn-primary form-control" onClick={() => add_saved()}>Adicionar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddYear