import React, { useState } from "react"
import axios from "axios"
import { Div, Text, Row, Col, Container, Image, Icon, Button } from "atomize"

import toast, { Toaster } from "react-hot-toast"

import react from "../../images/react.svg"

import icon1 from "../../images/feature-icons/1.svg"
import icon2 from "../../images/feature-icons/2.svg"
import icon3 from "../../images/feature-icons/3.svg"
import icon4 from "../../images/feature-icons/4.svg"
import icon5 from "../../images/feature-icons/5.svg"
import icon6 from "../../images/feature-icons/6.svg"

const featuresList = [
  {
    icon: icon5,
    heading: "Rest API",
    subheading: "Built on top of a robust Rest API.",
  },
  {
    icon: icon2,
    heading: "XLSX",
    subheading: "Upload your XLSX files and get started.",
  },
  {
    icon: icon4,
    heading: "Jira",
    subheading: "No need to go to Jira, we got you covered.",
  },

  {
    icon: icon6,
    heading: "Test Cases",
    subheading: "Create Test Cases and add them to your Test Plan.",
  },

  {
    icon: icon3,
    heading: "Customisable",
    subheading: "Customise your XLSX file as per your needs.",
  },
  {
    icon: icon1,
    heading: "Ligthning Fast",
    subheading: "Create Issues/Test Cases in a jiffy.",
  },
]

export default function Features() {
  const [issues, setIssues] = useState([])
  const [isValid, setIsValid] = useState(false) // added state variable
  const [isSubmitting, setIsSubmitting] = useState(false) // new state variable
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [issueCreated, setIssueCreated] = useState(false)

  const handleFileUpload = event => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) {
      // handle error when user presses "Esc" key or doesn't select a file
      setIsValid(false)
      return
    }
    if (
      selectedFile.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast.error("Error: Invalid file format")
      setIsValid(false)
      return
    }
    if (selectedFile.name === selectedFileName) {
      toast.error("Error: Same file uploaded")
      setIsValid(true)
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    toast.promise(
      fetch("https://jira-1qw7.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      })
        .then(response => {
          if (response.status === 200) {
            return response.text()
          } else {
            return response.json().then(error => {
              throw new Error(error.message)
            })
          }
        })
        .then(data => {
          const issue = JSON.parse(data).data
          setSelectedFileName(selectedFile.name)
          setIsValid(true)
          setIssues(issue)
          return "File uploaded successfully!"
        })
        .catch(error => {
          setIsValid(false)
          throw new Error(`Error: ${error.message}`)
        }),
      {
        loading: "Loading file...",
        success: message => {
          return message
        },
        error: error => {
          return error.message
        },
      }
    )
  }

  const handleSubmit = async event => {
    // Check if a file has been uploaded
    if (!selectedFileName) {
      toast.error("Please upload a file.")
      return
    }

    setIsSubmitting(true) // set isSubmitting to true when the form is submitted
    const promises = issues.map(async issue => {
      const issueData = {
        summary: issue.summary,
        description: issue.description,
        project_key: issue.project_key,
        issuetype_name: issue.issuetype_name,
        assignee_id: issue.assignee_id,
        priority: issue.priority,
        components: issue.components
          ? issue.components.split(", ").map(component => ({ name: component }))
          : [],
      }

      const payload = {
        fields: {
          project: { key: issueData.project_key },
          summary: issueData.summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    text: issueData.description,
                    type: "text",
                  },
                ],
              },
            ],
          },
          issuetype: { name: issueData.issuetype_name },
          assignee: { id: issueData.assignee_id },
          priority: { name: issueData.priority },
          components: issueData.components,
        },
      }
      try {
        const response = await axios.post(
          "https://jira-1qw7.onrender.com/api/issue",
          payload
        )
        const successMessage = `${response.data}`
        return Promise.resolve({ status: "fulfilled", value: successMessage })
      } catch (error) {
        return Promise.reject({ status: "rejected", reason: error })
      }
    })

    setSelectedFileName(null)

    toast.promise(
      Promise.allSettled(promises).then(results => {
        const rejectedPromises = results.filter(
          result => result.status === "rejected"
        )
        if (rejectedPromises.length > 0) {
          throw new Error(
            `Issues were not created successfully. \n Please try again with a different file. Or Check if XLSX file is in correct format.`
          )
        }
        const successMessages = results
          .filter(result => result.status === "fulfilled")
          .map(result => result.value)
        const values = successMessages.map(message => message.value)
        const joinedValues = values.join("\n")
        return joinedValues
      }),
      {
        loading: "Creating issues...",
        success: joinedValues => `${joinedValues}`,
        error: error => `Error: ${error.message}`,
      }
    )
  }

  return (
    <Div tag="section" id="file-upload">
      <Toaster />
      <Container>
        <Div
          p={{ t: "9.5rem", b: "5rem" }}
          border={{ b: "1px solid" }}
          borderColor="gray300"
        >
          <Row>
            <Col
              size={{ xs: 12, md: 5, lg: 4 }}
              d={{ xs: "none", md: "block" }}
            >
              <Div pos="relative" w="100%" p={{ b: "100%" }} m={{ t: "0rem" }}>
                <Div
                  pos="absolute"
                  top="1rem"
                  left="1rem"
                  right="0"
                  bottom="0"
                  rounded="circle"
                  border="2px solid"
                  borderColor="black"
                  opacity="0.1"
                ></Div>
                <Div
                  pos="absolute"
                  top="3rem"
                  left="3rem"
                  right="2rem"
                  bottom="2rem"
                  rounded="circle"
                  border="2px solid"
                  borderColor="black"
                  opacity="0.2"
                ></Div>
                <Div
                  pos="absolute"
                  top="5rem"
                  left="5rem"
                  right="4rem"
                  bottom="4rem"
                  rounded="circle"
                  border="2px solid"
                  borderColor="black"
                  opacity="0.3"
                ></Div>
                <Div
                  pos="absolute"
                  top="7rem"
                  left="7rem"
                  right="6rem"
                  bottom="6rem"
                  rounded="circle"
                  border="2px solid"
                  borderColor="black"
                  opacity="0.4"
                ></Div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  value=""
                  style={{ display: "none" }}
                />
                <Button
                  pos="absolute"
                  right="0"
                  bottom="4rem"
                  w="10rem"
                  rounded="lg"
                  bg="info700"
                  hoverBg="info600"
                  shadow="3"
                  hoverShadow="4"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                >
                  Upload File
                </Button>
                {isValid && selectedFileName ? (
                  <Button
                    pos="absolute"
                    right="-5rem"
                    bottom="1rem"
                    w="10rem"
                    rounded="lg"
                    hoverBg="info600"
                    shadow="3"
                    hoverShadow="4"
                    onClick={handleSubmit}
                    onSubmit={handleSubmit}
                    disabled={!isValid}
                  >
                    Submit
                  </Button>
                ) : null}
                <Button
                  pos="absolute"
                  left="2rem"
                  top="7.5rem"
                  w="2.5rem"
                  rounded="circle"
                  bg="warning700"
                  hoverBg="warning600"
                  shadow="3"
                  hoverShadow="4"
                >
                  <Icon name="Plus" color="white" size="18px" />
                </Button>
                <Icon
                  name="CBChecked"
                  pos="absolute"
                  left="5rem"
                  bottom="1rem"
                  color="danger700"
                />
                <Div
                  h="1.5rem"
                  w="2.5rem"
                  p="0.3rem"
                  pos="absolute"
                  top="3rem"
                  right="5rem"
                  rounded="circle"
                  bg="success700"
                  d="flex"
                  align="center"
                  justify="flex-end"
                  shadow="4"
                >
                  <Div h="0.9rem" w="0.9rem" rounded="circle" bg="white"></Div>
                </Div>
                <Div
                  pos="absolute"
                  top="7rem"
                  left="7rem"
                  right="6rem"
                  bottom="6rem"
                  rounded="circle"
                  d="flex"
                  align="center"
                  justify="center"
                >
                  <Image src={react} w="4rem" />
                </Div>
                {/* <Image
                    src={features}
                    pos="absolute"
                    top="0"
                    left="0"
                    w="100%"
                  /> */}
              </Div>
            </Col>
            <Col size={{ xs: 12, md: 6, lg: 7 }} offset={{ xs: 0, md: 1 }}>
              <Div p={{ l: { lg: "1rem" } }}>
                {/* <Tag
                    bg="black"
                    textColor="white"
                    h="2rem"
                    p={{ x: "1rem" }}
                    rounded="circle"
                    m={{ b: "2rem" }}
                  >
                    Key features
                  </Tag> */}

                <Text
                  tag="h2"
                  maxW="32rem"
                  fontFamily="secondary"
                  textSize="display2"
                  textWeight="500"
                  textAlign="left"
                  m={{ b: "3rem" }}
                >
                  Jira Wizard features a sleek and consistent{" "}
                  <span style={{ color: "#06d7ff" }}> user interface</span>.
                </Text>
                <Div>
                  <Row>
                    {featuresList.map((feature, index) => (
                      <Col size={{ xs: 6, lg: 4 }}>
                        <Div m={{ b: "3rem" }} maxW="11rem">
                          <Image
                            src={feature.icon}
                            w="2.5rem"
                            maxW="2.5rem"
                            m={{
                              b: "0.25rem",
                            }}
                          />

                          <Text
                            tag="h3"
                            textSize="subheader"
                            textWeight="500"
                            m={{ b: "0.25rem" }}
                          >
                            {feature.heading}
                          </Text>

                          <Text textSize="body" textColor="medium">
                            {feature.subheading}
                          </Text>
                        </Div>
                      </Col>
                    ))}
                  </Row>
                </Div>
              </Div>
            </Col>
          </Row>
        </Div>
      </Container>
    </Div>
  )
}
