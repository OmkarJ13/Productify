import React from "react";

class ModalWindowHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.openWindow = this.openWindow.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
  }

  openWindow() {
    this.props.onClick && this.props.onClick();
    if (!this.state.isOpen) this.setState({ isOpen: true });
  }

  closeWindow() {
    if (this.state.isOpen) this.setState({ isOpen: false });
  }

  render() {
    const { className, Window } = this.props;
    const { isOpen } = this.state;

    return (
      <>
        <Window open={isOpen} onClose={this.closeWindow} />
        <button onClick={this.openWindow} className={className}>
          {this.props.children}
        </button>
      </>
    );
  }
}

export default ModalWindowHandler;
