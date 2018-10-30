import React from 'react'
import { toast, ToastContainer, ToastType } from 'react-toastify'
import { AppNotification } from './entities'

interface ErrorBoundryProps {
  children: React.ReactChildren
}
interface ErrorBoundaryState {
  hasError: boolean
  error: any
  notification: AppNotification
}
export class ErrorBoundary extends React.PureComponent<ErrorBoundryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundryProps) {
    super(props)
    this.state = { hasError: false }
  }
  // @ts-ignore
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ error: error })
    this.notify()
  }

  notify = (notification?: AppNotification) => {
    if (this.state.error) {
      toast(this.state.error.toString(), {
        type: toast.TYPE.ERROR,
      })
    } else if (this.state.notification && this.state.notification.message) {
      toast(this.state.notification.message, {
        type: this.state.notification.type as ToastType,
      })
    } else if (notification) {
      toast(notification.message, {
        type: notification.type as ToastType,
      })
    }
  }

  render() {
    const children = React.Children.map(this.props.children, (child: React.ReactChild) => {
      return React.cloneElement(child as React.ReactElement<any>, {
        notify: this.notify,
      })
    })

    return (
      <React.Fragment>
        {children}
        <ToastContainer />
      </React.Fragment>
    )
  }
}
