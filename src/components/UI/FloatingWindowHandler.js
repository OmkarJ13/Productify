import React from "react";

class FloatingWindowHandler extends React.Component {
  constructor(props) {
    super(props);

    this.anchorEl = React.createRef();

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
    const { className, Window } = this.props;
    const { isOpen } = this.state;
    return (
      <>
        <Window
          open={isOpen}
          onClose={this.closeWindow}
          anchorEl={this.anchorEl}
        />
        <button
          className={className}
          onClick={this.toggleWindow}
          ref={this.anchorEl}
        >
          {this.props.children}
        </button>
      </>
    );
  }
}

export default FloatingWindowHandler;
