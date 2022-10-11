import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";

import "./assets/global.css";

import { EducationalText, SignInPrompt, SignOutButton } from "./ui-components";

// Step 1 for frontend setuup
import "bootstrap/dist/css/bootstrap.min.css";

// Step 2 Import needed components for homepage
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

// Step 4 Import Componentss
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";
import PollingStation from "./Components/PollingStation";
import NavComponent from "./Components/NavComponent";

export default function App({ isSignedIn, helloNEAR, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  // Get blockchian state once on component load
  React.useEffect(() => {
    helloNEAR
      .getGreeting()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }, []);

  const changeCandidatesFunction = async (prompt) => {
    console.log(prompt);
    let namePair = await window.contract.getCandidatePair({ prompt: prompt });
    localStorage.setItem("Candidate1", namePair[0]);
    localStorage.setItem("Candidate2", namePair[1]);
    localStorage.setItem("prompt", prompt);
    window.location.replace(window.location.href + "PollingStation");
  };

  const [promptList, changePromptList] = useState([
    "Which Pokemon is Best?",
    "Which city is best",
  ]);

  useEffect(() => {
    const getPrompts = async () => {
      changePromptList(await window.contract.getAllPrompts({}));
      console.log(await window.contract.getAllPrompts({}));
    };
    getPrompts();
  }, []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return (
      <SignInPrompt
        greeting={valueFromBlockchain}
        onClick={() => wallet.signIn()}
      />
    );
  }

  function changeGreeting(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;
    helloNEAR
      .setGreeting(greetingInput.value)
      .then(async () => {
        return helloNEAR.getGreeting();
      })
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  return (
    <React.Fragment>
      <NavComponent />
      <Container>
        <Table style={{ margin: "5vh" }} striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>List of Polls</th>
              <th>Go to Poll</th>
            </tr>
          </thead>
          <tbody>
            {promptList.map((el, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{el}</td>
                  <td>
                    {" "}
                    <Button onClick={() => changeCandidatesFunction(el)}>
                      Go to Poll
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </React.Fragment>
  );
}
