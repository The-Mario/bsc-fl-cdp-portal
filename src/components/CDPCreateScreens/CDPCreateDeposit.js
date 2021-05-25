import React from 'react';
import { Box, Grid, Text, Input, Card, Button } from '@makerdao/ui-components-core';
import { USDFL } from '../../libs/dai-plugin-mcd/src/index.js';
import { greaterThanOrEqual } from 'utils/bignumber';
import { TextBlock } from 'components/Typography';
import { formatCollateralizationRatio, formatter } from 'utils/ui';
import { cdpParamsAreValid } from '../../utils/cdp';
import useTokenAllowance from 'hooks/useTokenAllowance';
import useLanguage from 'hooks/useLanguage';
import useAnalytics from 'hooks/useAnalytics';
import ScreenFooter from '../ScreenFooter';
import ScreenHeader from '../ScreenHeader';
import RatioDisplay, { RatioDisplayTypes } from 'components/RatioDisplay';
import BigNumber from 'bignumber.js';
import { getColor } from 'styles/theme';

function OpenCDPForm({
  selectedIlk,
  cdpParams,
  handleInputChange,
  ilkData,
  dispatch,
  convertAmountToValue
}) {
  const { lang } = useLanguage();
  let {
    calculateMaxDai,
    debtFloor,
    collateralDebtAvailable,
    collateralAmountByValue
  } = ilkData;
  collateralDebtAvailable = collateralDebtAvailable?.toBigNumber();

  function convertValueToAmount(value) {
    if (value == 0) return BigNumber(0);
    const r = collateralAmountByValue(BigNumber(value));

    if (r == undefined) return BigNumber(0);
    return r;
  }

  const daiAvailable = calculateMaxDai(BigNumber(cdpParams.gemsToLock || '0'));
  const daiAvailableToGenerate = daiAvailable.gt(collateralDebtAvailable)
    ? collateralDebtAvailable.lt(debtFloor)
      ? BigNumber(0)
      : collateralDebtAvailable
    : daiAvailable;

  const belowDustLimit = debtFloor?.gt(BigNumber(cdpParams.daiToDraw));
  const aboveDebtCeiling =
    collateralDebtAvailable?.lt(BigNumber(cdpParams.daiToDraw)) &&
    collateralDebtAvailable?.gte(debtFloor);

  const negDebtAvailable = collateralDebtAvailable?.lt(debtFloor);

  const { hasSufficientAllowance } = useTokenAllowance(selectedIlk.gem);
  const userHasSufficientGemBalance = greaterThanOrEqual(
    selectedIlk.userGemBalance,
    cdpParams.gemsToLock
  );

  const userCanDrawDaiAmount = daiAvailable?.gte(
    BigNumber(cdpParams.daiToDraw === '' ? '0' : cdpParams.daiToDraw)
  );

  const userBalanceValue = convertAmountToValue(selectedIlk.userGemBalance);

  function handleValueChange({ target }) {
    if (parseFloat(target.value) < 0) return;

    const val = convertValueToAmount(target.value);
    dispatch({
      type: `form/set-gemsToLock`,
      payload: { value: val }
    });
  }
  function setMax({ target }) {
    const val = convertValueToAmount(target.value);
    dispatch({
      type: `form/set-setMax`,
      payload: { value: val }
    });
  }

  const fields = [
    [
      lang.formatString(
        lang.cdp_create.deposit_form_field1_title,
        selectedIlk.gem
      ),
      lang.formatString(
        lang.cdp_create.deposit_form_field1_text,
        selectedIlk.gem
      ),
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '1fr 1fr' }}
        gridGap="m"
        style={{ justifyItems: 'start', alignItems: 'start' }}
      >
        <Input
          style={{ fontSize: '14px', color: getColor('whiteText') }}
          key="collinput"
          name="valueToLock"
          after={'USD'}
          type="number"
          value={
            cdpParams.setMax
              ? formatter(convertAmountToValue(cdpParams.gemsToLock))
              : null
          }
          onChange={handleValueChange}
          width={300}
          borderColor="#323B4F"
          failureMessage={
            userHasSufficientGemBalance || !cdpParams.gemsToLock
              ? hasSufficientAllowance(
                cdpParams.gemsToLock === '' ? 0 : cdpParams.gemsToLock
              )

              : lang.formatString(
                lang.cdp_create.insufficient_ilk_balance,
                selectedIlk.gem
              )
          }
        />
        <Button
          className="btn_setmax"
          variant="secondary-outline"
          onClick={() => {
            setMax({
              target: {
                name: 'setMax',
                value: userBalanceValue
              }
            });
          }}
        >SET MAX</Button>
      </Grid>,
      <Box key="ba">
        <Text style={{ fontSize: '14px', color: getColor('whiteText') }}>
          {lang.your_balance}{' '}
        </Text>
        <Text
          style={{ fontSize: '14px', color: getColor('whiteText') }}
          display="inline-block"
          ml="s"
        >
          {formatter(userBalanceValue)} {'USD'}
        </Text>
      </Box>
    ],
    [
      lang.cdp_create.deposit_form_field3_title,
      lang.cdp_create.deposit_form_field3_text,
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '1fr 1fr' }}
        gridGap="m"
        style={{ justifyItems: 'start', alignItems: 'start' }}
      >
        <Input
          style={{ fontSize: '14px', color: getColor('whiteText') }}
          key="daiToDraw"
          name="daiToDraw"
          after="USDFL"
          width={300}
          borderColor="#323B4F"
          type="number"
          failureMessage={
            (belowDustLimit
              ? lang.formatString(lang.cdp_create.below_dust_limit, debtFloor)
              : null) ||
            (userCanDrawDaiAmount ? null : lang.cdp_create.draw_too_much_dai) ||
            (aboveDebtCeiling
              ? lang.formatString(
                lang.action_sidebar.generate_threshold,
                formatter(collateralDebtAvailable)
              )
              : null) ||
            (negDebtAvailable ? lang.action_sidebar.negative_debt_avail : null)
          }
          value={cdpParams.daiToDraw}
          onChange={handleInputChange}
        />
        <Button
          className="btn_setmax"
          variant="secondary-outline"
          onClick={() => {
            handleInputChange({
              target: {
                name: 'daiToDraw',
                value: formatter(daiAvailableToGenerate)
              }
            });
          }}
        >SET MAX</Button>
      </Grid>,
      <Grid gridRowGap="xs" key="keytodrawinfo">
        <Box key="ba">
          <Text style={{ fontSize: '14px', color: getColor('whiteText') }}>
            {lang.cdp_create.deposit_form_field3_after2}{' '}
          </Text>
          <Text
            display="inline-block"
            ml="s"
            style={{ fontSize: '14px', color: getColor('whiteText') }}
          >
            {formatter(daiAvailableToGenerate)} USDFL
          </Text>
        </Box>
      </Grid>
    ]
  ];

  return (
    <Grid gridRowGap="l" maxWidth="100%">
      <Grid
        gridTemplateColumns="auto"
        gridRowGap="l"
        gridColumnGap="m"
        alignItems="center"
      >
        {fields.map(([title, text, input, renderAfter]) => {
          return (
            <Grid gridRowGap="s" key={title}>
              <Grid gridRowGap="xs">
                <TextBlock
                  style={{ fontSize: '18px', color: getColor('whiteText') }}
                  lineHeight="normal"
                >
                  {title}
                </TextBlock>
                <TextBlock
                  style={{ fontSize: '16px', color: getColor('greyText') }}
                >
                  {text}
                </TextBlock>
              </Grid>
              <Box py="2xs">{input}</Box>
              {renderAfter}
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

const CDPCreateDepositSidebar = ({
  cdpParams,
  selectedIlk,
  ilkData,
  collateralizationRatio
}) => {
  const { lang } = useLanguage();
  const currency = selectedIlk.currency;
  let {
    annualStabilityFee,
    collateralDebtAvailable
  } = ilkData;

  collateralDebtAvailable = collateralDebtAvailable?.toBigNumber();

  const maxDaiAvailableToGenerate = collateralDebtAvailable?.lt(0)
    ? BigNumber(0)
    : collateralDebtAvailable;

  let liquidationPriceDisplay = formatter(
    ilkData.calculateliquidationPrice(
      currency(cdpParams.gemsToLock || '0'),
      USDFL(cdpParams.daiToDraw || '0')
    )
  );
  if ([Infinity, 'Infinity'].includes(liquidationPriceDisplay))
    liquidationPriceDisplay = '0.0000';
  return (
    <Grid gridRowGap="m">
      {[
        [
          lang.collateralization,
          <RatioDisplay
            key="ba"
            type={RatioDisplayTypes.TEXT}
            text={`${formatCollateralizationRatio(
              collateralizationRatio
            )} (Min ${formatter(ilkData.liquidationRatio, {
              percentage: true
            })}%)`}
            ratio={formatter(collateralizationRatio)}
            ilkLiqRatio={formatter(ilkData.liquidationRatio, {
              percentage: true
            })}
            t="caption"
          />
        ],
        [
          lang.stability_fee,
          `${formatter(annualStabilityFee, {
            percentage: true,
            rounding: BigNumber.ROUND_HALF_UP
          })}%`
        ],
        [
          lang.cdp_create.max_dai_available_to_generate,
          `${formatter(maxDaiAvailableToGenerate)} USDFL`
        ]
      ].map(([title, value]) => (
        <Grid gridRowGap="xs" key={title}>
          <TextBlock
            style={{ fontSize: '18px', color: getColor('whiteText') }}
            lineHeight="normal"
          >
            {title}
          </TextBlock>
          <TextBlock style={{ fontSize: '14px', color: getColor('greyText') }}>
            {value}
          </TextBlock>
        </Grid>
      ))}
    </Grid>
  );
};

const CDPCreateDeposit = ({
  selectedIlk,
  cdpParams,
  isFirstVault,
  hasSufficientAllowance,
  hasAllowance,
  collateralTypesData,
  dispatch
}) => {
  const { lang } = useLanguage();
  const { trackBtnClick } = useAnalytics('DepositGenerate', 'VaultCreate');

  const { gemsToLock, daiToDraw } = cdpParams;

  const ilkData = collateralTypesData.find(
    x => x.symbol === selectedIlk.symbol
  );
  const { calculateMaxDai, debtFloor, collateralValueForAmount } = ilkData;
  const daiAvailable = calculateMaxDai(BigNumber(cdpParams.gemsToLock || '0'));

  const collateralizationRatio = ilkData.calculateCollateralizationRatio(
    BigNumber(cdpParams.gemsToLock || '0'),
    USDFL(cdpParams.daiToDraw || '0')
  );

  function convertAmountToValue(amount) {
    if (amount == 0) return BigNumber(0);
    const r = collateralValueForAmount(BigNumber(amount)).toFixed(3);

    if (r) return BigNumber(r);

    return BigNumber(0);
  }

  const valueToLock = convertAmountToValue(cdpParams.gemsToLock);


  function handleInputChange({ target }) {
    if (parseFloat(target.value) < 0) return;
    dispatch({
      type: `form/set-${target.name}`,
      payload: { value: target.value }
    });
  }

  const canProgress =
    cdpParamsAreValid(
      cdpParams,
      selectedIlk.userGemBalance,
      debtFloor,
      daiAvailable
    ) &&
    hasSufficientAllowance(cdpParams.gemsToLock)

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <ScreenHeader
        title={lang.formatString(
          lang.cdp_create.deposit_title,
          selectedIlk.gem
        )}
        text={lang.cdp_create.deposit_text}
      />
      <Grid
        gridTemplateColumns={{ s: 'minmax(0, 1fr)', l: '2fr 1fr' }}
        gridGap="m"
        my="l"
      >
        <Card
          px={{ s: 'm', m: 'xl' }}
          py={{ s: 'm', m: 'l' }}
          style={{
            backgroundColor: getColor('cardBg'),
            borderColor: getColor('cardBg'),
            borderRadius: '13px'
          }}
        >
          <OpenCDPForm
            cdpParams={cdpParams}
            handleInputChange={handleInputChange}
            selectedIlk={selectedIlk}
            ilkData={ilkData}
            collateralizationRatio={collateralizationRatio}
            dispatch={dispatch}
            convertAmountToValue={convertAmountToValue}
          />
        </Card>
        <Card
          px={{ s: 'm', m: 'xl' }}
          py={{ s: 'm', m: 'l' }}
          style={{
            backgroundColor: getColor('cardBg'),
            borderColor: getColor('cardBg'),
            borderRadius: '13px'
          }}
        >
          <CDPCreateDepositSidebar
            selectedIlk={selectedIlk}
            cdpParams={cdpParams}
            ilkData={ilkData}
            collateralizationRatio={collateralizationRatio}
          />
        </Card>
      </Grid>
      <ScreenFooter
        onNext={() => {
          trackBtnClick('Next', {
            lock: gemsToLock,
            generate: daiToDraw,
            isFirstVault
          });
          dispatch({ type: 'increment-step' });
        }}
        onBack={() => {
          trackBtnClick('Back', { isFirstVault });
          dispatch({
            type: 'decrement-step',
            payload: { by: hasAllowance ? 2 : 1 }
          });
        }}
        canProgress={canProgress}
      />
    </Box>
  );
};
export default CDPCreateDeposit;
