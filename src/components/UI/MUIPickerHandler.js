import React from "react";

class MUIPickerHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.openPicker = this.openPicker.bind(this);
    this.closePicker = this.closePicker.bind(this);
  }

  openPicker(e) {
    if (!this.state.open) this.setState({ open: true });
  }

  closePicker(e) {
    if (this.state.open) this.setState({ open: false });
  }

  render() {
    const { open } = this.state;

    return this.props.renderPicker({
      open,
      onClose: this.closePicker,
      InputProps: {
        onClick: this.openPicker,
      },
    });
  }
}

export default MUIPickerHandler;
