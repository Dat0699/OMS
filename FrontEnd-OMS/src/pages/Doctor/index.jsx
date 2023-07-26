import React, { useState } from "react";

import "./style.css";

const listPatient = [
    {id: 1, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
    {id: 2, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
    {id: 3, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
    {id: 4, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
    {id: 5, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
    {id: 6, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
    {id: 7, lastName: "Nguyen", firstName: "Dat", gender: "men", address: "addreess", birthdate: "12/12/12", status: "new"},
]

const colunmHeader = {
    default: [
        "ID", "Last Name", "FirstName", "Gender", "Address", "BirthDate", "Status"
    ]
}["default"]

const DoctorPage = () => {

    return (
        <div className="doctor-page">
            <div className="row">
				<div className="col-md-12">
					<div className="table-wrap">
						<table className="table table-striped">
						  <thead>
                            <tr>
                                {colunmHeader.map((item, idx) => {
                                    return (
                                        <th>{item}</th>
                                    )
                                })}
                                </tr>
						   
						  </thead>
						  <tbody>
                            {listPatient.map((item, idx) => {
                                return (
						            <tr  style={{background: idx % 2 === 0 ? "#5de0e6": "white"}}>
                                         <th scope="row">{item.id}</th>
                                        <td>{item.lastName}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.gender}</td>
                                        <td>{item.address}</td>
                                        <td>{item.birthdate}</td>
                                        <td><a href="#" className="btn btn-success">{item.status}</a></td>
                                    </tr>
                                )
                            })}
						  </tbody>
						</table>
					</div>
				</div>
			</div>
        </div>
    )
}

export default DoctorPage;