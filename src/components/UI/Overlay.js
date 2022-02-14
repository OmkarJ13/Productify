import React from "react";
import reactDom from "react-dom";

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.overlayPortal = document.getElementById("overlay-portal");
  }

  render() {
    const { opacity, zIndex, onClick } = this.props;
    const style = {
      backgroundColor: `rgba(0, 0, 0, ${opacity ?? 0})`,
      zIndex: `${zIndex ?? 0}`,
    };

    return reactDom.createPortal(
      <div
        style={style}
        onClick={onClick}
        className="fixed top-0 left-0 h-screen w-screen animate-[fade_ease-in-out_250ms]"
      />,
      this.overlayPortal
    );
  }
}

export default Overlay;
