import React, { Component } from 'react';
import Lottie from 'react-lottie';
import animationData from 'images/animation/PC_version.json';

class AnimationLottie extends Component {
  render() {
    const defaultOptions = {
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
        progressiveLoad: false,
        clearCanvas: false,
      }
    };

    return <Lottie options={defaultOptions} height={400} width={400} isClickToPauseDisabled={true} />;
  }
}

export default AnimationLottie;
