import React from 'react';
import { hot } from 'react-hot-loader/root';

import MarketingLayout from '../layouts/MarketingLayout';
import LegalTextLayout from '../layouts/LegalTextLayout';

const Privacy = () => (
  <MarketingLayout>
    <LegalTextLayout>
      <h1>Terms of use</h1>
      <span className="subheading">Last Revised: 21 Dec 2020</span>
      <h2>General risk disclosure</h2>
      <p>
        The developer team of Freeliquid has made its best to ensure the safety
        of the Freeliquid Protocol. We have extensively tested our smart
        contracts and the website platform, both before and right after the
        launch. Being a fork of MakerDAO, Freeliquid has also inherited its
        level of security, which remains well-proven since years.
      </p>
      <p>
        Nevertheless, users of Freeliquid must acknowledge the risks that come
        with using blockchain services and the Ethereum network in particular.
        We urge users to always inform themselves about potential threats and
        take the most precautions while using Freeliquid. Please read our{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://freeliquid.io/wp/Freeliquid_WP_English.pdf"
        >
          white paper
        </a>{' '}
        and watch the{' '}
        <a 
          target="_blank" 
          rel="noopener noreferrer"
          href="https://vimeo.com/493096918">
          tutorial
        </a>{' '}
        before investing.
      </p>
      <p>
        It is especially important to guarantee the safety of your crypto
        wallet. If it is lost or compromised, there is no way to gain back your
        funds at Freeliquid. Never share your seed phrase or private keys of
        your wallet with anyone. Please note that the developer team of
        Freeliquid will never ask you to transfer your funds or share an access
        to your wallet - all such requests are simply a scam attempt.
      </p>

      <h2>Audit</h2>

      <p>
        The Freeliquid Protocol and its smart contracts have been audited by
        Beosin Blockchain Security. Freeliquid successfully passed all audit
        items with the smart contracts rated as fully functional. The full report
        is available at{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://beosin.com/vaasApi/report/download?num=19e334590140a7117f09ef7aa4df9943"
        >
          the following link.
        </a>
      </p>

      <h2>Financial risks</h2>
      <p>
        At the time of the launch, Freeliquid Borrow supports collaterals
        consisting of stablecoin pairs only, which implies minimal risks. If
        more volatile crypto assets are to be supported later, user funds in
        Vaults can be liquidated, if the collateral price drops below the
        liquidation threshold. Before investing, users should make sure they
        understand how liquidation works and manage the risks accordingly.
      </p>
      <p>
        The Freeliquid Protocol derives the price of crypto assets by using the{' '}
        <a 
          target="_blank" 
          rel="noopener noreferrer"
          href="https://chain.link/">
          Chainlink
        </a>{' '}
        oracle system. Freeliquid holds no responsibility for any financial
        damage that might be caused by possible oracle malfunctions.
      </p>

      <h2>Governance</h2>

      <p>
        The Freeliquid Protocol is governed by the decentralized community of FL
        token holders. Through community voting users are eligible to propose
        changes to the Freeliquid protocol. This can include adjusting
        parameters that are directly related to user investments, for example,
        the required collateralization ratio or the interest rate (Stability
        Fees) in Freeliquid Borrow. Make sure to always follow the Freeliquid’s
        community updates in order not to skip important changes that might
        affect your investments. The voting process and possible changes that
        can be proposed are described in Chapter 3 of the Freeliquid’s white
        paper.
      </p>

      <h2>Privacy policy</h2>
      <p>
        The Freeliquid Protocol is a non-custodial, decentralized financial
        service, which does not require any personal data from its users.
        Freeliquid web platform does not host any user accounts - the
        interaction with smart contracts happens only by connecting a crypto
        wallet. As with any other ERC-20 token, all transactions involving FL or
        USDFL are publicly available on Ethereum network and respective
        blockchain explorers. The use of Freeliquid, however, remains fully
        anonymous, unless users themselves disclose the ownership of their
        personal wallets.
      </p>
    </LegalTextLayout>
  </MarketingLayout>
);

export default hot(Privacy);
