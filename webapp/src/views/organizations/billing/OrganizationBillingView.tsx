import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { T, useTranslate } from '@tolgee/react';
import { styled, Typography } from '@mui/material';

import { BaseOrganizationSettingsView } from 'tg.views/organizations/components/BaseOrganizationSettingsView';
import { LINKS } from 'tg.constants/links';
import { useOrganization } from 'tg.views/organizations/useOrganization';
import {
  useApiQuery,
  useBillingApiMutation,
  useBillingApiQuery,
} from 'tg.service/http/useQueryApi';
import { useOrganizationCreditBalance } from './useOrganizationCreditBalance';
import { BillingPlans } from './BillingPlans/BillingPlans';
import { Credits } from './Credits/Credits';
import { CustomerPortal } from './CustomerPortal/CustomerPortal';
import { CurrentUsage } from './CurrentUsage/CurrentUsage';
import { BillingPeriodType } from './BillingPlans/PeriodSwitch';

const StyledCurrent = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 16px;
  margin: 16px 0px;
  align-items: start;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StyledShopping = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  margin: 16px 0px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const OrganizationBillingView: FunctionComponent = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const success = params.has('success');

  const organization = useOrganization();

  const creditBalance = useOrganizationCreditBalance();
  const t = useTranslate();

  const url = new URL(window.location.href);

  const [period, setPeriod] = useState<BillingPeriodType>('YEARLY');

  url.search = '';

  const refreshSubscription = useBillingApiMutation({
    url: `/v2/organizations/{organizationId}/billing/refresh-subscription`,
    method: `put`,
    invalidatePrefix: `/`,
  });

  useEffect(() => {
    if (success) {
      refreshSubscription.mutate({
        path: { organizationId: organization!.id },
      });
    }
  }, [success]);

  const plansLoadable = useBillingApiQuery({
    url: `/v2/organizations/{organizationId}/billing/plans`,
    method: 'get',
    path: {
      organizationId: organization!.id,
    },
  });

  const activePlan = useBillingApiQuery({
    url: '/v2/organizations/{organizationId}/billing/active-plan',
    method: 'get',
    path: {
      organizationId: organization!.id,
    },
    options: {
      onSuccess(data) {
        if (data.currentBillingPeriod) {
          setPeriod(data.currentBillingPeriod);
        }
      },
    },
  });

  const usage = useApiQuery({
    url: '/v2/organizations/{organizationId}/usage',
    method: 'get',
    path: {
      organizationId: organization!.id,
    },
  });

  return (
    <BaseOrganizationSettingsView
      title={t('organization_billing_title')}
      hideChildrenOnLoading={true}
      loading={
        activePlan.isLoading ||
        plansLoadable.isLoading ||
        refreshSubscription.isLoading ||
        activePlan.isLoading ||
        usage.isLoading
      }
      link={LINKS.ORGANIZATION_BILLING}
      navigation={[
        [
          t('organization_menu_billing'),
          LINKS.ORGANIZATION_BILLING.build({ slug: organization!.slug }),
        ],
      ]}
      windowTitle={t({ key: 'organization_billing_title', noWrap: true })}
      containerMaxWidth="xl"
    >
      {plansLoadable.data?._embedded?.plans &&
        activePlan.data &&
        usage.data &&
        creditBalance.data && (
          <>
            <StyledCurrent>
              <CurrentUsage
                activePlan={activePlan.data}
                usage={usage.data}
                balance={creditBalance.data}
              />
              <CustomerPortal />
            </StyledCurrent>
            <Typography variant="h6">
              <T>organization_pricing_plans_title</T>
            </Typography>
            <StyledShopping>
              <BillingPlans
                plans={plansLoadable.data._embedded.plans}
                activePlan={activePlan.data}
                onPeriodChange={(period) => setPeriod(period)}
                period={period}
              />
              <Credits />
            </StyledShopping>
          </>
        )}
    </BaseOrganizationSettingsView>
  );
};
