
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Loader } from './Loader';

export const Createpost = () => {

    const history = useHistory();

    const [Body, setBody] = useState("")
    const [image, setimage] = useState("")
    const [url, seturl] = useState("")
    const [loading, setloading] = useState(false);
    const [status, setStatus] = useState("")

    useEffect(() => {
        if (url) {
            fetch("http://localhost:3001/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({

                    body: Body,
                    photo: url
                })

            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    }
                    else {
                        console.log(data.message);
                        setloading(false)
                        history.push("/mypost");
                    }
                }).catch(err => {
                    console.log(err);
                })

        }
    }, [url])//when url changes, code will execute

    const postDetails = () => {
        setloading(true)
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "social-network");
        formData.append("cloud_name", "nusracloud")

        fetch("https://api.cloudinary.com/v1_1/nusracloud/image/upload", {
            method: "POST",
            body: formData
        }).then(res => res.json()).then(data => {
            seturl(data.url)
        }).catch(err => {
            console.log(err);
        })
    }

    const postStatus=()=>{
        console.log(status);
        fetch("http://localhost:3001/createstatus", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    status: status,
                })

            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                    }
                    else {
                        console.log(data.message);
                        setloading(false)
                        history.push("/status");
                    }
                }).catch(err => {
                    console.log(err);
                })
    }

    
    return (
        <div className="container" >
            <div className="card input-field" style={{ margin: "50px auto", maxWidth: "500px", textAlign: "center" }}>
                <div className="card-content">
                   

                    <input
                        type="text"
                        placeholder="Write a caption"
                        value={Body}
                        onChange={(e) => {
                            setBody(e.target.value)
                        }}
                    />

                    <div className="file-field input-field">
                        <div className="btn-floating btn-large waves-light#006064 cyan darken-4" style={{ paddingBottom: "55px" }}>
                            <i className="material-icons" style={{ fontSize: "30px" }}>add</i>

                            <input type="file" multiple
                                onChange={(e) => {
                                    console.log(e.target.files)
                                    setimage(e.target.files[0])
                                }}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Add photo" />

                        </div>

                    </div>
                    <button
                        className="btn waves-effect waves-light#006064 cyan darken-4"
                        type="submit"
                        name="action"
                        onClick={postDetails}
                    >Upload
                        <i className="material-icons right">send</i>
                    </button>
                </div>

            </div>

            <div className="card input-field" style={{ margin: "50px auto", maxWidth: "500px", textAlign: "center" }}>
                <div className="card-content">
                   

                    <input
                        type="text"
                        placeholder="Type a Status"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                        }}
                    />

            
                    <button
                        className="btn waves-effect waves-light#006064 cyan darken-4"
                        type="submit"
                        name="action"
                        onClick={postStatus}
                    >Upload
                        <i className="material-icons right">send</i>
                    </button>
                </div>

            </div>

            
            {loading ? <Loader /> : null}
        </div>
    )
}
