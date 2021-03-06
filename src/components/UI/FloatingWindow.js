import React from "react";
import reactDom from "react-dom";

import Overlay from "./Overlay";

class FloatingWindow extends React.Component {
  constructor(props) {
    super(props);

    this.floatingWindow = React.createRef();

    this.state = {
      x: 0,
      y: 0,
    };

    this.windowPortal = document.getElementById("window-portal");
    this.windowResizeHandler = this.windowResizeHandler.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.windowResizeHandler);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open != this.props.open) this.updatePosition();
  }

  windowResizeHandler(e) {
    this.updatePosition();
  }

  // Automatically updates the position of the window to fit inside the screen
  updatePosition() {
    const { buttonRef } = this.props;
    const windowRef = this.floatingWindow.current;
    if (!buttonRef.current || !windowRef) return;

    const anchorBounds = buttonRef.current.getBoundingClientRect();
    const windowBounds = this.floatingWindow.current.getBoundingClientRect();

    const screenX = window.innerWidth;
    const screenY = window.innerHeight;

    let x =
      anchorBounds.left +
      anchorBounds.width * 0.5 -
      windowBounds.width * 0.5 +
      window.scrollX;
    let y = anchorBounds.bottom + window.scrollY;

    if (x < window.screenLeft) {
      x = anchorBounds.left + window.scrollX;
    }

    if (x + windowBounds.width > screenX) {
      x =
        anchorBounds.left -
        (windowBounds.width - anchorBounds.width) +
        window.scrollX;
    }

    if (y + windowBounds.height > screenY) {
      y =
        anchorBounds.bottom -
        (windowBounds.height + anchorBounds.height) +
        window.scrollY;
    }

    this.setState({
      x,
      y,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.windowResizeHandler);
  }

  render() {
    const { open } = this.props;
    const { x, y } = this.state;

    return open ? (
      <>
        <Overlay opacity={0} zIndex={5} onClick={this.props.onClose} />
        {reactDom.createPortal(
          <div
            style={{ top: `${y}px`, left: `${x}px` }}
            ref={this.floatingWindow}
            className={`absolute z-10 max-w-full animate-[fade_ease-in-out_250ms] border border-gray-200 bg-white shadow-lg`}
          >
            {this.props.children}
          </div>,
          this.windowPortal
        )}
      </>
    ) : null;
  }
}

export default FloatingWindow;
