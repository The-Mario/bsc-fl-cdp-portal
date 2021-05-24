import { buildTestService } from '../helpers/serviceBuilders';

let nonceService;

beforeEach(async () => {
  nonceService = buildTestService('nonce', { nonce: true });
  await nonceService.manager().authenticate();
});

function currentAccount() {
  return nonceService._web3Service.currentAddress();
}

test('should properly fetch the transaction count', async () => {
  const count = await nonceService._getTxCount(currentAccount());

  expect(typeof count).toEqual('number');
  expect(count).toBeGreaterThan(0);
});

test('should properly initialize the counts in state', async () => {
  const originalCounts = nonceService._counts;
  nonceService._counts = {};
  await nonceService.setCounts();

  expect(typeof nonceService._counts).toEqual('object');
  expect(nonceService._counts).toEqual(originalCounts);
  expect(Object.keys(nonceService._counts).includes(currentAccount()));
});

test('should set different counts for each signer', async () => {
  const accountsList = nonceService._accountsService.listAccounts();
  await nonceService.setCounts();

  expect(typeof nonceService._counts).toEqual('object');
  expect(Object.keys(nonceService._counts).length).toEqual(accountsList.length);
});

test('should return its own tx count if higher than count from node', async () => {
  nonceService._counts[currentAccount()] = 500000;
  const nonce = await nonceService.getNonce();

  expect(nonce).toEqual(500000);
});

test('should return tx count from node if higher than own count', async () => {
  nonceService._counts[currentAccount()] = 0;
  const nonce = await nonceService.getNonce();

  expect(nonce).not.toEqual(0);
});

test('should return a nonce even when own count is undefined', async () => {
  nonceService._counts[currentAccount()] = undefined;
  const nonce = await nonceService.getNonce();

  expect(typeof nonce).toEqual('number');
});

test('should not compare duplicate addresses and nonce counts', async () => {
  const accountsList = [
    {
      name: 'duplicate1',
      type: 'test',
      address: '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6'
    },
    {
      name: 'duplicate2',
      type: 'test',
      address: '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6'
    }
  ];

  const mockListAccounts = jest.fn(() => accountsList);
  nonceService._accountsService.listAccounts = mockListAccounts;

  const uniqueAddresses = nonceService._removeDuplicateAddresses(accountsList);

  const spy = jest.spyOn(nonceService, '_getTxCount');
  await nonceService.setCounts();

  expect(spy).toBeCalledTimes(2);
  expect(Object.keys(nonceService._counts).length).toEqual(
    uniqueAddresses.length
  );
});
