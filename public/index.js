import React, { Component } from "react";
import { render } from "react-dom";
import PropTypes from "prop-types";
import "./init";
import SettingsModal from "./components/modal";
import NavBottom from "./components/NavBottom";
import SideMenu from "./components/sidemenu";
import SnackBar from "./components/snackbar";
import Header from "./components/header";

export class App extends Component {
  static propTypes = {};
  // Check to make sure service workers are supported in the current browser,
// and that the current page is accessed from a secure origin. Using a
// service worker from an insecure origin will trigger JS console errors.
 isLocalhost = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
)
);
  initServiceWorker() {
    if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.protocol === "http:" || isLocalhost)) {
      if ("serviceWorker" in navigator) {
        let newWorker;
        navigator.serviceWorker.register("./service-worker.js").then(reg => {
          console.log("Service Worker Registered");
          reg.addEventListener("updatefound", () => {
            // A wild service worker has appeared in reg.installing!
            if (navigator.serviceWorker.controller) {
              newWorker = reg.installing;
              if (newWorker != null) {
                newWorker.addEventListener("statechange", () => {
                  // Has network.state changed?
                  switch (newWorker.state) {
                    case "installed":
                      // new update available
                      showUpdateBar();
                      break;
                  }
                });
              }
            }
          });
        });

        let refreshing;
        navigator.serviceWorker.addEventListener("controllerchange", function() {
          if (refreshing) return;
          window.location.reload();
          refreshing = true;
        });

        function showUpdateBar() {
          let snackbar = document.getElementById("snackbar");
          snackbar.className = "show";
        }
        // The click event on the pop up notification
        document.getElementById("reload").addEventListener("click", function() {
          newWorker.postMessage({
            action: "skipWaiting"
          });
        });
      }
    }
  }

  componentDidMount() {
    this.initServiceWorker();
  }

  render() {
    return (
      <React.Fragment>
        <NavBottom />
        <section className="row-section">
          <SideMenu />
          <SettingsModal />
          <div className="container">
            <Header />
            <div className="row">
              <div id="tvframe" />
              <div id="loading" />
            </div>
          </div>
          <SnackBar />
        </section>
      </React.Fragment>
    );
  }
}

render(<App />, document.getElementById("app"));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
