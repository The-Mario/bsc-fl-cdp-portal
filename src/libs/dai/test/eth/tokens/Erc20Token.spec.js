import TestAccountProvider from '@makerdao/test-helpers/src/TestAccountProvider';
import { buildTestEthereumTokenService } from '../../helpers/serviceBuilders';
import { FL, WETH } from '../../../src/eth/Currency';
import { UINT256_MAX } from '../../../src/utils/constants';

let tokenService, mkr, weth, currentAddress, testAddress;

beforeAll(async () => {
  tokenService = buildTestEthereumTokenService();
  await tokenService.manager().authenticate();
  mkr = tokenService.getToken(FL);
  weth = tokenService.getToken(WETH);
  currentAddress = tokenService.get('web3').currentAddress();
});

beforeEach(() => {
  testAddress = TestAccountProvider.nextAddress();
});

test('get ERC20 (FL) balance of address', async () => {
  const balance = await mkr.balanceOf(TestAccountProvider.nextAddress());
  expect(balance).toEqual(FL(0));
});

test('get ERC20 (FL) allowance of address', async () => {
  const allowance = await mkr.allowance(
    TestAccountProvider.nextAddress(),
    TestAccountProvider.nextAddress()
  );
  expect(allowance).toEqual(FL(0));
});

test('approve an ERC20 (FL) allowance', async () => {
  await mkr.approve(testAddress, 10000);
  let allowance = await mkr.allowance(currentAddress, testAddress);
  expect(allowance).toEqual(FL(10000));

  await mkr.approve(testAddress, 0);
  allowance = await mkr.allowance(currentAddress, testAddress);
  expect(allowance).toEqual(FL(0));
});

test('approveUnlimited an ERC20 (FL) allowance', async () => {
  await mkr.approveUnlimited(testAddress);
  const allowance = await mkr.allowance(currentAddress, testAddress);
  expect(allowance).toEqual(FL.wei(UINT256_MAX));
});

test('ERC20 transfer should move transferValue from sender to receiver', async () => {
  await weth.deposit('0.1');
  const senderBalance = await weth.balanceOf(currentAddress);
  const receiverBalance = await weth.balanceOf(testAddress);

  await weth.transfer(testAddress, '0.1');
  const newSenderBalance = await weth.balanceOf(currentAddress);
  const newReceiverBalance = await weth.balanceOf(testAddress);

  expect(newSenderBalance).toEqual(senderBalance.minus(0.1));
  expect(newReceiverBalance).toEqual(receiverBalance.plus(0.1));
});

test('ERC20 transferFrom should move transferValue from sender to receiver', async () => {
  await weth.deposit('0.1');
  const senderBalance = await weth.balanceOf(currentAddress);
  const receiverBalance = await weth.balanceOf(testAddress);

  await weth.transferFrom(currentAddress, testAddress, '0.1');
  const newSenderBalance = await weth.balanceOf(currentAddress);
  const newReceiverBalance = await weth.balanceOf(testAddress);

  expect(newSenderBalance).toEqual(senderBalance.minus(0.1));
  expect(newReceiverBalance).toEqual(receiverBalance.plus(0.1));
});

test('totalSupply() should increase when new tokens are minted', async () => {
  const supply1 = await weth.totalSupply();
  await weth.deposit(0.1);
  const supply2 = await weth.totalSupply();
  expect(supply1.plus(0.1)).toEqual(supply2);
});
