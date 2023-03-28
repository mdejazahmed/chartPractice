/* eslint-disable camelcase */
// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstant.initial,
    vaccinationData: [],
  }

  componentDidMount = () => {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    this.setState({apiStatus: apiStatusConstant.inProgress})

    const res = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (res.status === 200) {
      const data = await res.json()
      console.log(data)
      this.setState({
        apiStatus: apiStatusConstant.success,
        vaccinationData: data,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="failureViewContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failureImg"
      />
      <h1 className="failureTitle">something went wrong</h1>
    </div>
  )

  renderSuccessView = () => {
    const {vaccinationData} = this.state
    const {
      last_7_days_vaccination,
      vaccination_by_gender,
      vaccination_by_age,
    } = vaccinationData
    return (
      <>
        <VaccinationCoverage totalVaccination={last_7_days_vaccination} />
        <VaccinationByGender vaccinationByGender={vaccination_by_gender} />
        <VaccinationByAge vaccinationByAge={vaccination_by_age} />
      </>
    )
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="loaderContainer">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.inProgress:
        return this.renderLoaderView()
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="mainContainer">
        <div className="wrapper">
          <header className="logoContainer">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <h1 className="name">Co-WIN</h1>
          </header>
          <h1 className="title">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetails()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
