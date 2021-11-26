import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Search from './Search'
import { Loader } from './Loader'

export default function Status() {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [loading, setloading] = useState(false);

    useEffect(() => {
        setloading(true)
        fetch("http://localhost:3001/allsubstatus", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result)
                setloading(false)
                 console.log(result);
            })
    }, [])



    const deleteStatus = (id) => {
        setloading(true)
        fetch("http://localhost:3001/deletestatus/" + id, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.filter(item => {
                    return item._id !== result._id

                })
                setData(newData)
                setloading(false)
            })
    }
    return (
        <div className="container home">
            <div >
                <Search></Search>
            </div>
            {data.slice(0).reverse().map(item => {
                return (
                    <div className="card home-card" key={item._id}>
                        <h5 style={{ padding: "5px 0px 0px 10px" }}><Link
                            to={"/profile/" + item.postedby._id}>{item.postedby.name}</Link></h5>
                        {state._id === item.postedby._id ? <i className="material-icons"
                            style={{ color: "black", marginTop: "-30px", marginLeft: "420px",cursor:"pointer"  }}
                            onClick={() => {
                                deleteStatus(item._id)
                            }}
                        >
                            delete
                        </i> : ""}
                        <div className="card-image card-content" style={{fontSize:"25px", textAlign:"center",backgroundColor:"ThreeDLightShadow",}}>
                            <p>{item.status}</p>
                        </div>

                    </div>
                )
            })}

            {loading ? <Loader /> : null}
        </div>
    )
}

