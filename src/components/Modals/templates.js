import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from 'react-spring';
import { getColor } from 'styles/theme';

const animations = {
  fade: [{ opacity: 0 }, { opacity: 1 }],
  fadeUp: [
    {
      opacity: 0,
      transform: 'scale(0.99) translate3d(0, 10px, 0)'
    },
    {
      opacity: 1,
      transform: 'scale(1) translate3d(0, 0, 0)'
    }
  ]
};

const Bg = styled(animated.div)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 2001;
  overflow-y: auto;
  background: ${getColor('cardBg')};
`;

const SimpleBg = styled(Bg)`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${getColor('cardBg')};
`;

const FullscreenModal = forwardRef(
  ({ show, onClose, modalProps, children }, ref) => {
    const [fadeUpStart, fadeUpEnd] = animations.fadeUp;

    const [animation, setAnimation] = useSpring(() => ({
      to: fadeUpEnd,
      from: fadeUpStart,
      config: config.stiff
    }));

    if (!show) return null;

    const onCloseAnimated = () => {
      setAnimation({
        to: fadeUpStart,
        onRest() {
          onClose();
        }
      });
    };

    return (
      <Bg ref={ref} onClick={onCloseAnimated} style={animation}>
        {children({ ...modalProps, onClose: onCloseAnimated })}
      </Bg>
    );
  }
);

const BasicModal = forwardRef(
  ({ show, onClose, modalProps, children }, ref) => {
    if (!show) return null;
    const [fadeStart, fadeEnd] = animations.fade;
    const [fadeUpStart, fadeUpEnd] = animations.fadeUp;

    const ModalContent = styled(animated.div)`
      background-color: ${getColor('cardBg')};
      border-radius: 6px;
      padding: ${({ theme }) => theme.space.m}px;
      box-shadow: 0px 3px 13px rgba(67, 67, 67, 0.13);
    `;

    const [bgAnimation, setBgAnimation] = useSpring(() => ({
      to: fadeEnd,
      from: fadeStart,
      config: config.stiff
    }));

    const [contentAnimation, setContentAnimation] = useSpring(() => ({
      to: fadeUpEnd,
      from: fadeUpStart,
      config: config.stiff
    }));

    const onCloseAnimated = () => {
      setBgAnimation({
        to: fadeStart
      });

      setContentAnimation({
        to: fadeUpStart,
        onRest() {
          onClose();
        }
      });
    };

    return (
      <SimpleBg
        ref={ref}
        onClick={onCloseAnimated}
        css={{
          backgroundColor: '#0B0E15'
        }}
        style={bgAnimation}
      >
        <ModalContent
          style={contentAnimation}
          onClick={e => e.stopPropagation()}
        >
          {children({ ...modalProps, onClose: onCloseAnimated })}
        </ModalContent>
      </SimpleBg>
    );
  }
);

const templates = {
  fullscreen: FullscreenModal,
  basic: BasicModal,
  default: BasicModal
};

export default templates;
