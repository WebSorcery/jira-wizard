import React, { useState, useEffect } from "react"
import { Div, Container, Button } from "atomize"
import upWordIcon from "../../images/icons/upWord.png"
export default function BackToTopSection() {
  const [isVisible, setIsVisible] = useState(false)

  const handleScroll = () => {
    const scrollY = window.scrollY
    const threshold = 300

    setIsVisible(scrollY > threshold)
  }

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Div p={{ y: "3.5rem" }}>
      <Container>
        <Div
          pos="fixed"
          bottom={{ xs: "1.5rem", md: "2rem" }}
          right={{ xs: "1.5rem", md: "2rem" }}
          zIndex="500"
        >
          <Button
            rounded="circle"
            shadow="1"
            hoverShadow="4"
            w={{ xs: "3rem", md: "4rem" }}
            h={{ xs: "3rem", md: "4rem" }}
            onClick={handleClick}
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <img
              style={{ height: "100%", width: "100%", objectFit: "scale-down" }}
              src={upWordIcon}
              alt="Back to top"
            />
          </Button>
        </Div>
      </Container>
    </Div>
  )
}
