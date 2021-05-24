import React, { useState } from 'react';
import { Flex, Text, Link, Card, Grid, Box } from '@makerdao/ui-components-core';
import { ReactComponent as EthIcon } from 'images/tokens/icon-coin-eth.svg';
import { ReactComponent as BscIcon } from 'images/tokens/icon-coin-bsc.svg';
import BnBsc from 'images/bn_bsc.png';

import useLanguage from 'hooks/useLanguage';
import { getColor } from 'styles/theme';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TradeNav = ({ ...props }) => {
  const { lang } = useLanguage();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <Box
      style={{
        textAlign: 'center',
      }}>
      <Text
        style={{
          color: getColor('greyText'),
          textAlign: 'center',

        }}
      >{lang.navbar.network}
      </Text>
      <Card
        style={{
          background: getColor('cardBg'),
          border: getColor('border'),
          padding: '3px',
          margin: '5px 25px',
        }}
      >

        <Grid
          gridTemplateColumns="1fr 1fr"
          gridColumnGap="3px"
          gridRowGap="6px"
          padding="3px"

        >
          <Link>
            <Flex
              className="network_box"
              style={{
                background: '#222B3F',
              }}>
              <EthIcon className="network_img" />
              <Text t="p6" fontWeight="bold" color={'white'}>
                {lang.navbar.eth}
              </Text>
            </Flex>
          </Link>
          <Link
            className="modalVideo"
            onClick={() => setModalIsOpen(true)}>
            <Flex
              className="network_box"
              style={{
                background: getColor('cardBg'),
              }}>
              <BscIcon className="network_img" />
              <Text t="p6" fontWeight="bold" color={'gray'}>
                {lang.navbar.bsc}
              </Text>
            </Flex>
          </Link>
        </Grid>
      </Card>
      <div className="modalVideo">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            overlay: {
              background: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              background: '#222B3F',
              border: 'none',
              width: '40%',
              height: '62%',
              margin: 'auto'
            }
          }}
        >
          <img src={BnBsc} alt="Binance" />
          <Text.h4
            style={{
              color: getColor('whiteText'),
              textAlign: 'center',
              padding: '20px 10px'
            }}
          >
            {lang.landing_page.banner_in_progress}
          </Text.h4>
          <Text
            style={{
              color: getColor('greyText'),
              textAlign: 'center',
              padding: '20px 10px'
            }}
          >
            {lang.landing_page.banner_binance}
          </Text>
          <br />
          <Link
            className="link_banner"
            href="https://freeliquid.medium.com/freeliquid-proposes-an-expansion-to-bsc-edcc8e8bec9f"
            target="_blank"
            rel="noopener noreferrer"
          >
            {lang.landing_page.banner_link}
          </Link>
          <button
            className="close_btn"
            onClick={() => setModalIsOpen(false)}
          >
            &times;
                </button>
        </Modal>
      </div>
    </Box>
  );
};

export default TradeNav;
