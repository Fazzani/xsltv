import React from "react";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";

export class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.element
  };
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // @ts-ignore
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ error: error });
    this.notify();
  }

  notify = notification => {
    if (this.state.error) {
      toast(this.state.error.toString(), {
        type: toast.TYPE.ERROR
      });
    } else if (this.state.notification && this.state.notification.message) {
      toast(this.state.notification.message, {
        type: this.state.notification.type
      });
    } else if (notification) {
      toast(notification.message, {
        type: notification.type
      });
    }
  };

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        notify: this.notify
      });
    });

    return (
      <React.Fragment>
        {children}
        <ToastContainer />
      </React.Fragment>
    );
  }
}
