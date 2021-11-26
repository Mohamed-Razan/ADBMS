import React from 'react'

export const Loader = () => {
    return (
        <div className="fp-container">
            <div className="d-flex justify-content-center fp-loader">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    )
}
