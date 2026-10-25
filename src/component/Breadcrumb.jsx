import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({title, description, category}) => {
    return (
        <div className="page-header">
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span className="separator">/</span>
                <Link to="#">{category}</Link>
                <span className="separator">/</span>
                <span>{title}</span>
            </div>
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    )
}

export default Breadcrumb 
