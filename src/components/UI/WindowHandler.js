import React from "react";

class WindowHandler extends React.Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();

    this.state = {
      isOpen: false,
    };

    this.toggleWindow = this.toggleWindow.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
  }

  toggleWindow() {
    this.setState((prevState) => {
      return {
        isOpen: !prevState.isOpen,
      };
    });
  }

  closeWindow() {
    if (this.state.isOpen) this.setState({ isOpen: false });
  }

  render() {
    const { isOpen } = this.state;
    return (
      <>
        {this.props.renderWindow({
          open: isOpen,
          onClose: this.closeWindow,
          buttonRef: this.buttonRef,
        })}

        <button
          {...this.props}
          onClick={this.toggleWindow}
          ref={this.buttonRef}
        >
          {this.props.children}
        </button>
      </>
    );
  }
}

export default WindowHandler;
