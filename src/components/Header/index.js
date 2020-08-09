import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-md-10">
                            <Link className="navbar-brand" to="/">My Money</Link>
                        </div>
                        <div className="col-sm-12 col-md-2">
                            <Link to="/" className="btn btn-outline-secondary">Voltar</Link>   
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header