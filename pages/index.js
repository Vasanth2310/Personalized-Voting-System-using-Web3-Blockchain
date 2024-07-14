import { useState, useEffect } from "react";
import { description, endDate, propTitle, startDate, choices } from "./propdata"; // Adjusted import path for propdata
import 'sf-font';
import { fetchPoll, fetchVoter, vote } from "../components/soroban";
import { retrievePublicKey, checkConnection } from "../components/freighter";

export default function Board() {
  const [total, setTotal] = useState(0);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [publicKey, setPublicKey] = useState("Wallet not connected...");
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    if (publicKey !== "Wallet not connected...") {
      setConnectStatus('Connected!');
      fetchPoll().then((values) => {
        fetchVotes(values);
      });
    }
  }, [publicKey]);

  const openModal = () => {
    const { Modal } = require("bootstrap");
    const myModal = new Modal("#msgmodal");
    myModal.show();
  }

  const closeModal = () => {
    const { Modal } = require("bootstrap");
    let modal = Modal.getInstance(document.getElementById('msgmodal'));
    modal.hide();
  }

  const loadOptions = () => {
    let choicebutton = document.getElementById("choicebuttons");
    let _button = document.createElement("button");
    _button.onclick = () => getVoter();
    _button.id = "initiate";
    _button.innerHTML = "Initiate";
    _button.className = "w-100 btn btn-md mb-3";
    _button.style.backgroundColor = '#ab20fd';
    _button.style.color = 'white';
    choicebutton.appendChild(_button);
    choicebutton.appendChild(document.createElement("br"));
  }

  const getVoter = async () => {
    let voterInfo = await fetchVoter();
    let choiceButtons = document.getElementById("choicebuttons");
    let initButton = document.getElementById("initiate");
    initButton.remove();
    if (voterInfo.selected === "none") {
      for (let i = 0; i < choices.length; i++) {
        let choiceDesc = choices[i];
        let _button = document.createElement("button");
        _button.value = choiceDesc;
        _button.onclick = () => submitVote(choiceDesc);
        _button.innerHTML = choiceDesc;
        _button.className = "w-100 btn btn-md mb-3";
        _button.style.backgroundColor = '#ab20fd';
        _button.style.color = 'white';
        choiceButtons.appendChild(_button);
        choiceButtons.appendChild(document.createElement("br"));
      }
      return;
    } else {
      let title = document.createElement("h5");
      title.textContent = "Vote Already Submitted";
      title.style.color = 'white';
      let choice = document.createElement("h5");
      choice.textContent = "Voted: " + voterInfo.selected;
      choice.style.color = 'white';
      choiceButtons.appendChild(title);
      choiceButtons.appendChild(choice);
      return;
    }
  }

  const connectWallet = async () => {
    setModalMsg('connecting.svg');
    openModal();
    if (await checkConnection()) {
      let publicKey = await retrievePublicKey(); // Changed getPublicKey to retrievePublicKey
      setPublicKey(publicKey);
    }
  }

  const fetchVotes = async (poll) => {
    let values = [poll.yes, poll.no];
    setTotal(poll.total);
    let container = document.getElementById("choicecontainer");
    for (let i = 0; i < choices.length; i++) {
      let choiceCount = values[i];
      let choiceDesc = choices[i];
      if (choiceCount === 0) {
        let div2 = document.createElement("div");
        let html2 = `
          <h5>${choiceDesc}: ${choiceCount}</h5>
          <h5>0%</h5>
        `;
        div2.innerHTML = html2;
        container.appendChild(div2);
        container.appendChild(document.createElement("br"));
      } else {
        let choicePercent = ((100 * choiceCount) / poll.total).toFixed(2);
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        div2.className = "progress-bar my-0";
        div2.role = "progressbar";
        div2.style.backgroundColor = '#9D00FF';
        div2.style.textAlign = 'right';
        div2.style.width = (choicePercent / 4) + 'rem';
        let html1 = `
          <h5>${choiceDesc}: ${choiceCount}</h5>
        `;
        let html2 = `
          <h5>${choicePercent}%</h5>
        `;
        div1.innerHTML = html1;
        div2.innerHTML = html2;
        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(document.createElement("br"));
      }
    }
    setModalMsg('connected.svg');
    await new Promise(r => setTimeout(r, 3000));
    loadOptions();
    closeModal();
    return;
  }

  const submitVote = async (value) => {
    setModalMsg("executing.svg");
    openModal();
    await vote(value);
    setModalMsg("recorded.svg");
    await new Promise(r => setTimeout(r, 3000));
    closeModal();
    location.reload();
  }

  return (
    <>
      <div id="msgmodal" className="modal fade in" data-bs-keyboard="false" data-bs-backdrop="static" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-badge py-3" style={{ background: "#000000" }}>
            <img src={modalMsg} width={300} className="mx-auto" alt="Modal message" />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-3 d-flex flex-column justify-content-between" style={{ minHeight: '100vh' }}>
            <div className="mb-3">
              <h1 style={{ fontWeight: 'bold', textShadow: '0px 1px 10px #ffffff20' }}>{propTitle}</h1>
              <div className="card">
                <h5 className="card-header">Proposal Description</h5>
                <div className="card-body">
                  <h5 className="card-title mt-3">Empowering decentralized applications with innovative solutions.</h5>
                  <p className="card-text mb-4">{description}</p>
                </div>
              </div>
            </div>
            <ul className="list-group mt-3">
              <li className="list-group-item d-flex justify-content-between" style={{ backgroundColor: '#00000090' }}>
                <div>
                  <h6 className="my-0 text-white">Created by</h6>
                  <span style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold' }}>BIOMORPH AI</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-md-9">
            <div className="py-3 px-3">
              <div className="row py-0 d-flex justify-content-between">
                <div className="col-md-6">
                  <ul className="list-group mb-1">
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">Start Date</h6>
                      </div>
                      <span className="text-black">{startDate}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">End Date</h6>
                      </div>
                      <span className="text-black">{endDate}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                      <div>
                        <h6 className="my-0">Total Votes</h6>
                      </div>
                      <h3 className="text-black">{total}</h3>
                    </li>
                  </ul>
                  <form className="card border rounded" style={{ backgroundColor: '#000000' }}>
                    <h5 className="d-flex justify-content-center mx-auto my-auto"
                      style={{ color: 'white', borderRadius: '2px' }}>Proposal Voting Stats</h5>
                    <div className="input-group">
                      <div className="choicecontainer" id="choicecontainer" />
                    </div>
                  </form>
                </div>

                <div className="col-md-6">
                  <div className="row m-0 d-flex justify-content-between">
                    <ul className="list-group">
                      <li className="list-group-item" style={{ backgroundColor: '#00000070', boxShadow: '0px 1px 5px #000' }}>
                        <div className="col-12">
                          <h4 className="mb-3" style={{ color: 'white' }}>Vote</h4>
                          <p id="displayvote" style={{ fontSize: '17px', color: 'white', fontWeight: '800' }}></p>
                          <div id="choicebuttons" />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="row my-auto p-2 d-flex justify-content-center">
                    <ul className="list-group">
                      <li className="list-group-item" style={{ backgroundColor: '#00000070' }}>
                        <div className="col-4">
                          <div className="w-55 d-flex btn justify-content-center" onClick={connectWallet} style={{ backgroundColor: '#634CC9', boxShadow: '0px 1px 5px #000' }}>
                            <h6 className="my-1 mx-2" style={{ color: 'white' }}>{connectStatus}</h6>
                            <img src="freighter.svg" width={30} alt="Freighter" />
                          </div>
                          <span style={{ color: '#ffffff', fontWeight: '500', fontSize: '0.85rem' }}>{publicKey}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <footer className="my-5 pt-5 text-muted text-center text-small">
                <p style={{ color: 'white' }} className="mb-1">&copy; 2024 biomorphai.io</p>
                <ul className="list-inline">
                </ul>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
