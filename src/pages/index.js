import React from "react"
import LogRocket from 'logrocket';

import Layout from "../components/layout"
import SEO from "../components/seo"
import Header from "../components/common/header"
import HeroSection from "../components/homepage/HeroSection"
import Introducing from "../components/homepage/Introducing"
import Features from "../components/homepage/Features"
import Craft from "../components/homepage/Craft"
import DesignDevelopment from "../components/homepage/DesignDevelopment"
import GetStartedBanner from "../components/homepage/GetStartedBanner"
import Footer from "../components/homepage/Footer"
import BackToTopSection from "../components/common/BackToTopSection"

LogRocket.init('mbkjpk/jira-wizard');

const IndexPage = () => (
  <Layout>
    <SEO
      title="JiraWizard - Jira Automation Made Easy"
      description="JiraWizard is a Jira automation tool that allows you to automate your Jira workflows with ease."
    />
    <Header />
    <HeroSection />
    <Introducing />
    <Features />
    <Craft />
    <DesignDevelopment />
    <GetStartedBanner />
    <BackToTopSection />
    <Footer />
  </Layout>
)

export default IndexPage
