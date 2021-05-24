import { PublicService } from '@makerdao/services-core';
import { ServiceRoles } from './constants';
import BigNumber from 'bignumber.js';
import tracksTransactions from './utils/tracksTransactions';
import ERC20TokenAbi from '../contracts/abis/ERC20.json';

export default class RewardService extends PublicService {
  constructor(name = ServiceRoles.REWARDS) {
    super(name, [
      'smartContract',
      'proxy',
      'accounts',
      'web3',
      ServiceRoles.SYSTEM_DATA
    ]);
  }

  get proxyActions() {
    return this.get('smartContract').getContract('PROXY_ACTIONS_REWARD');
  }

  get holderHighRisk() {
    return this.get('smartContract').getContract('FL_REWARDER_GOV_USD_HOLDER');
  }

  holder(highRisk) {
    return this.get('smartContract').getContract(
      highRisk ? 'FL_REWARDER_GOV_USD_HOLDER' : 'FL_REWARDER_STABLES_HOLDER'
    );
  }

  @tracksTransactions
  async claimReward({ promise }) {
    return this.proxyActions.claimReward(
      this.get('smartContract').getContractAddress('FL_REWARDER'),
      { dsProxy: true, promise }
    );
  }

  @tracksTransactions
  async lockPool(amount, gem, highRisk, { promise }) {
    // stake(uint256 amount, address gem)
    return this.holder(highRisk).stake(amount, gem, {
      dsProxy: false,
      promise
    });
  }

  @tracksTransactions
  async unlockPool(amount, gem, highRisk, { promise }) {
    // function withdraw(uint256 amount, address gem)
    return this.holder(highRisk).withdraw(amount, gem, {
      dsProxy: false,
      promise
    });
  }

  @tracksTransactions
  async poolApprove(amount, gem, highRisk, { promise }) {
    const scs = this.get('smartContract');
    const contract = scs.getContractByAddressAndAbi(gem, ERC20TokenAbi);
    return contract.approve(this.holder(highRisk).address, -1, {
      dsProxy: false,
      promise
    });
  }

  @tracksTransactions
  async claimRewardEx({ promise }) {
    return this.get('smartContract')
      .getContract('FL_REWARD_AGGREGATOR')
      .claimReward({ dsProxy: false, promise });
  }

  @tracksTransactions
  async claimRewardHiRisk({ promise }) {
    return this.get('smartContract')
      .getContract('FL_REWARDER_GOV_USD')
      .getReward({ dsProxy: false, promise });
  }

  @tracksTransactions
  async claimRewardLowRisk({ promise }) {
    return this.get('smartContract')
      .getContract('FL_REWARDER_STABLES')
      .getReward({ dsProxy: false, promise });
  }

}
