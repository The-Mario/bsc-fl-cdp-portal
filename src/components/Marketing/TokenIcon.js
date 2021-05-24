import React from 'react';

import { ReactComponent as BatIcon } from 'images/tokens/bat.svg';
import { ReactComponent as CompIcon } from 'images/tokens/comp.svg';
import { ReactComponent as DaiIcon } from 'images/tokens/dai.svg';
import { ReactComponent as EthIcon } from 'images/tokens/eth.svg';
import { ReactComponent as KncIcon } from 'images/tokens/knc.svg';
import { ReactComponent as LinkIcon } from 'images/tokens/link.svg';
import { ReactComponent as ManaIcon } from 'images/tokens/mana.svg';
import { ReactComponent as PaxIcon } from 'images/tokens/pax.svg';
import { ReactComponent as TusdIcon } from 'images/tokens/tusd.svg';
import { ReactComponent as UsdlIcon } from 'images/tokens/usdl.svg';
import { ReactComponent as UsdtIcon } from 'images/tokens/usdt.svg';
import { ReactComponent as UsdcIcon } from 'images/tokens/usdc.svg';
import { ReactComponent as WbtcIcon } from 'images/tokens/wbtc.svg';
import { ReactComponent as ZrxIcon } from 'images/tokens/zrx.svg';
import { ReactComponent as LpgIcon } from 'images/tokens/lpg.svg';
import { ReactComponent as DefaultIcon } from 'images/tokens/default.svg';

const iconsByToken = {
  BAT: BatIcon,
  COMP: CompIcon,
  DAI: DaiIcon,
  ETH: EthIcon,
  KNC: KncIcon,
  LINK: LinkIcon,
  MANA: ManaIcon,
  PAX: PaxIcon,
  TUSD: TusdIcon,
  USDFL: UsdlIcon,
  USDT: UsdtIcon,
  LPG: LpgIcon,
  USDC: UsdcIcon,
  WBTC: WbtcIcon,
  ZRX: ZrxIcon,
  BUSDDAI: DefaultIcon,
  BUSDUSDT: DefaultIcon,
  BUSDUSDC: DefaultIcon
  //USDTUSDN: DefaultIcon,
  //USDNDAI: DefaultIcon,
  //USDCUSDN: DefaultIcon
};

const TokenIcon = ({ symbol, size = 70, ...props }) => {
  const Icon = iconsByToken[symbol.toUpperCase()] || DefaultIcon;

  return <Icon width={size} height={size} {...props} />;
};

export default TokenIcon;
