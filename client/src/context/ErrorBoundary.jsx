import React, { Component } from "react";
import FiveZeroZero from "../components/Errors/FiveZeroZero";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FiveZeroZero />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
