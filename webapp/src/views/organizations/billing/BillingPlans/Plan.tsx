import { FC } from 'react';
import { styled, Box } from '@mui/material';
import { useTranslate } from '@tolgee/react';

import { components } from 'tg.service/billingApiSchema.generated';
import { PlanInfo } from './PlanInfo';
import { usePlan } from './usePlan';
import { PlanActionButton } from './PlanActionButton';
import { PlanTitle } from './PlanTitle';
import { PlanPrice } from './PlanPrice';
import { PrepareUpgradeDialog } from '../PrepareUpgradeDialog';
import { PeriodSwitch, BillingPeriodType } from './PeriodSwitch';
import clsx from 'clsx';

type PlanModel = components['schemas']['PlanModel'];
type Period = components['schemas']['SubscribeRequest']['period'];

const StyledPlan = styled('div')`
  position: relative;
  background: ${({ theme }) => theme.palette.emphasis[50]};
  border: 1px solid ${({ theme }) => theme.palette.emphasis[200]};
  border-radius: 20px;
  overflow: hidden;
`;

const StyledContent = styled('div')`
  padding: 20px;
  padding-top: 25px;
  display: grid;
  gap: 8px;
  grid-template-rows: 1fr auto auto;
  grid-template-areas:
    'title '
    'info  '
    'action';
`;

const StyledSubtitle = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  font-size: 14px;
  padding: 0px 20px 0px 20px;
  color: ${({ theme }) => theme.palette.primary.main};
  background: ${({ theme }) =>
    theme.palette.mode === 'light' ? '#f3cfe0' : '#47333d'};
`;

type Props = {
  plan: PlanModel;
  isOrganizationSubscribed: boolean;
  period: Period;
  onPeriodChange: (period: BillingPeriodType) => void;
  isActive: boolean;
  isEnded: boolean;
};

export const Plan: FC<Props> = ({
  plan,
  isOrganizationSubscribed,
  period,
  onPeriodChange,
  isActive,
  isEnded,
}) => {
  const t = useTranslate();
  const {
    onPrepareUpgrade,
    prepareUpgradeMutation,
    onSubscribe,
    subscribeMutation,
    onCancel,
    cancelMutation,
  } = usePlan({ planId: plan.id, period: period });

  return (
    <StyledPlan className={clsx({ active: isActive })}>
      {isActive && (
        <StyledSubtitle>
          {isEnded
            ? t('billing_subscription_cancelled')
            : t('billing_subscription_active')}
        </StyledSubtitle>
      )}
      <StyledContent>
        <PlanTitle title={plan.name} />

        <PlanInfo plan={plan} />

        <Box
          gridArea="action"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <PlanPrice
            price={
              period === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyPrice / 12
            }
            period={period}
          />

          {!plan.free && (
            <PeriodSwitch value={period} onChange={onPeriodChange} />
          )}

          {!plan.free &&
            (isActive && !isEnded ? (
              <PlanActionButton
                loading={cancelMutation.isLoading}
                onClick={() => onCancel()}
              >
                {t('billing_plan_cancel')}
              </PlanActionButton>
            ) : isActive && isEnded ? (
              <PlanActionButton
                loading={prepareUpgradeMutation.isLoading}
                onClick={() => onPrepareUpgrade()}
              >
                {t('billing_plan_resubscribe')}
              </PlanActionButton>
            ) : isOrganizationSubscribed ? (
              <PlanActionButton
                loading={prepareUpgradeMutation.isLoading}
                onClick={() => onPrepareUpgrade()}
              >
                {t('billing_plan_subscribe')}
              </PlanActionButton>
            ) : (
              <PlanActionButton
                loading={subscribeMutation.isLoading}
                onClick={() => onSubscribe()}
              >
                {t('billing_plan_subscribe')}
              </PlanActionButton>
            ))}

          {prepareUpgradeMutation.data && (
            <PrepareUpgradeDialog
              data={prepareUpgradeMutation.data}
              onClose={() => {
                prepareUpgradeMutation.reset();
              }}
            />
          )}
        </Box>
      </StyledContent>
    </StyledPlan>
  );
};
