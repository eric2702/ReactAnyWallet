import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { authActions } from "../store/auth";
const axios = require("axios");

const Dashboard = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(authActions.logout());
  };
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [transactions, setTransaction] = useState([{}]);

  const [formData, setFormData] = useState({
    details: "",
    category_id: "",
    nominal: "",
  });

  const { details, category_id, nominal } = formData;

  function handleChange(e) {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  }

  function handleSubmit(e) {
    e.preventDefault();

    let data = [...transactions];
    data.push({
      id: 1,
      details: formData.details,
      category_id: formData.category_id,
      nominal: formData.nominal,
    });
    setTransaction(data);
  }

  async function getName() {
    try {
      const response = await axios.get("http://localhost:5000/dashboard/", {
        headers: {
          token: localStorage.token,
        },
      });

      const parseRes = response.data;

      setName(parseRes.name);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getTransaction() {
    try {
      const response = await axios.get(
        "http://localhost:5000/dashboard/get_trans",
        {
          headers: {
            token: localStorage.token,
          },
        }
      );

      const parseRes = response.data;

      setTransaction(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function getDate() {
    try {
      let dateNow = new Date();
      let now =
        days[dateNow.getDay()] +
        ", " +
        dateNow.getDate().toString() +
        " " +
        monthNames[dateNow.getMonth()] +
        " " +
        dateNow.getFullYear().toString();
      setDate(now);
    } catch (err) {
      console.error(err.message);
    }
  }

  const onSubmitTransaction = async (e) => {
    e.preventDefault();

    const responseUserId = await axios.get(
      "http://localhost:5000/dashboard/user_id",
      {
        headers: {
          token: localStorage.token,
        },
      }
    );

    const user_id = responseUserId.data;
    const body = { details, nominal, category_id, user_id };
    body.category_id = parseInt(category_id);
    body.nominal = parseInt(nominal);
    console.log(body);

    try {
      const response = await axios.post(
        "http://localhost:5000/dashboard/",
        body,
        {
          headers: {
            token: localStorage.token,
          },
        }
      );

      const parseRes = response.data;
      console.log(response.data);

      if (parseRes == "error_nominal") {
        toast.error("Masukkan Nominal Lebih dari 0!");
      } else if (parseRes == "error_data_type") {
        toast.error("Masukkan Data yang Benar!");
      } else {
        toast.success("Transaction Added Successfully!");
        setFormData({ details: "", category_id: "", nominal: "" });
        e.preventDefault();

        const responseTransaction = await axios.get(
          "http://localhost:5000/dashboard/get_trans",
          {
            headers: {
              token: localStorage.token,
            },
          }
        );
        console.log(responseTransaction);
        const parseResTrans = responseTransaction.data;
        setTransaction(parseResTrans);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    logoutHandler();
    toast.error("Logged out successfully");
  };

  useEffect(() => {
    getName();
    getTransaction();
    getDate();
  }, []);
  return (
    //AMOUNT
    <div>
      <h1>Dashboard {name}</h1>
      <button className="btn btn-primary" onClick={(e) => logout(e)}>
        Logout
      </button>
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body text-primary">
                <h5 className="card-title">Balance</h5>
                <p className="card-text">RP 3.000.000</p>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body text-success">
                <h5 className="card-title">Income</h5>
                <p className="card-text">Rp 5.000.000</p>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body text-danger">
                <h5 className="card-title">Expense</h5>
                <p className="card-text">RP 2.000.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* TRANSACTIONS */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-4">
            <p style={{ fontWeight: "bold" }}>{date}</p>
          </div>
          <div className="col-sm-3"></div>
          <div className="col-sm-3">
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#staticBackdrop"
            >
              Add Transaction
            </button>
            <div
              className="modal fade"
              id="staticBackdrop"
              data-backdrop="static"
              data-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <form onSubmit={onSubmitTransaction}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Add Transaction
                      </h5>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-4">
                          <div className="card">
                            <div className="mx-3 my-2">
                              <p className="card-title small font-weight-light m-0">
                                Wallet
                              </p>
                              <span className="font-weight-bolder">{name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="card">
                            <div className="mx-3 my-2">
                              <p className="card-title small font-weight-light m-0">
                                Category
                              </p>
                              <div class="input-group input-group-sm m-0">
                                {/* <input
                                  type="number"
                                  name="category_id"
                                  className="form-control border-0"
                                  aria-label="Sizing example input"
                                  aria-describedby="inputGroup-sizing-sm"
                                  placeholder="input category"
                                  value={formData.category_id}
                                  onChange={handleChange}
                                /> */}
                                <select
                                  class="form-control"
                                  id="exampleFormControlSelect1"
                                  name="category_id"
                                  aria-label="Sizing example input"
                                  aria-describedby="inputGroup-sizing-sm"
                                  value={formData.category_id}
                                  onChange={handleChange}
                                >
                                  <option value="0">Select Category</option>
                                  <option value="1">Income</option>
                                  <option value="2">Expense</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="card m-0">
                            <div className="mx-3 my-1">
                              <p className="card-title small font-weight-light m-0">
                                Nominal
                              </p>
                              <div className="input-group input-group-sm m-0">
                                <input
                                  type="number"
                                  name="nominal"
                                  className="form-control border-0"
                                  aria-label="Sizing example input"
                                  aria-describedby="inputGroup-sizing-sm"
                                  placeholder="0"
                                  value={formData.nominal}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mt-4">
                        <div className="col-4">
                          <div className="card">
                            <div className="mx-3 my-2">
                              <p className="card-title small font-weight-light m-0">
                                Date
                              </p>
                              <span className="font-weight-bolder">{date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="card">
                            <div className="mx-3 my-2">
                              <p className="card-title small font-weight-light m-0">
                                Details
                              </p>
                              <div className="input-group input-group-sm m-0">
                                <input
                                  type="text"
                                  name="details"
                                  className="form-control border-0"
                                  aria-label="Sizing example input"
                                  aria-describedby="inputGroup-sizing-sm"
                                  placeholder="Isi Details Transaction"
                                  value={formData.details}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5 container">
          <table className="table table-bordered" id="dataTable" width="100%">
            <thead>
              <tr>
                <th>Details</th>
                <th>Nominal</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.details}</td>
                  <td>{transaction.nominal}</td>
                  <td>{transaction.category_name}</td>
                  <td>{transaction.date_created_updated}</td>
                  <td>
                    <button className="btn btn-warning btn-circle btn-sm m-0">
                      Edit
                    </button>
                    <button className="btn btn-danger btn-circle btn-sm mx-2">
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
