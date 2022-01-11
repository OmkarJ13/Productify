import React from "react";

class FloatingWindow extends React.Component {
  constructor(props) {
    super(props);
    this.floatingWindow = React.createRef();
    this.documentClickHandler = this.documentClickHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.documentClickHandler);
  }

  documentClickHandler(e) {
    if (!this.floatingWindow.current.contains(e.target)) {
      this.props.onClose();
    }
  }

  render() {
    return (
      <div
        className="absolute top-full right-0 z-10 bg-white shadow-lg animate-[fade_ease-in-out_250ms] border border-gray-200"
        ref={this.floatingWindow}
      >
        {this.props.children}
      </div>
    );
  }
}

export default FloatingWindow;
