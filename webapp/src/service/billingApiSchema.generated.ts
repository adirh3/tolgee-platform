/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/v2/organizations/{organizationId}/billing/update-subscription": {
    /** Updates subscription */
    put: operations["updateSubscription"];
  };
  "/v2/organizations/{organizationId}/billing/refresh-subscription": {
    /** Refreshes organizations subscription by Stripe data */
    put: operations["refresh"];
  };
  "/v2/organizations/{organizationId}/billing/prepare-update-subscription": {
    /** Prepares update subscription session */
    put: operations["prepareUpdateSubscription"];
  };
  "/v2/organizations/{organizationId}/billing/cancel-subscription": {
    /** Cancels subscription */
    put: operations["cancelSubscription"];
  };
  "/v2/public/billing/webhook": {
    post: operations["webhook"];
  };
  "/v2/organizations/{organizationId}/billing/subscribe": {
    /** Returns url of Stripe checkout session */
    post: operations["subscribe"];
  };
  "/v2/organizations/{organizationId}/billing/buy-more-credits": {
    /** Returns url of Stripe checkout session to buy more credits */
    post: operations["getBuyMoreCreditsCheckoutSessionUrl"];
  };
  "/v2/organizations/{organizationId}/billing/plans": {
    get: operations["getPlans"];
  };
  "/v2/organizations/{organizationId}/billing/invoices/{invoiceId}/pdf": {
    /** Returns organization invoices */
    get: operations["getInvoicePdf"];
  };
  "/v2/organizations/{organizationId}/billing/invoices/": {
    /** Returns organization invoices */
    get: operations["getInvoices"];
  };
  "/v2/organizations/{organizationId}/billing/customer-portal": {
    /** Returns url of Stripe customer portal session */
    get: operations["goToCustomerPortal"];
  };
  "/v2/organizations/{organizationId}/billing/active-plan": {
    /** Refreshes organizations subscription by Stripe data */
    get: operations["getActivePlan"];
  };
  "/v2/billing/plans": {
    get: operations["getPlans_1"];
  };
  "/v2/billing/mt-credit-prices": {
    get: operations["getMtCreditPrices"];
  };
}

export interface components {
  schemas: {
    UpdateSubscriptionRequest: {
      token: string;
    };
    ActivePlanModel: {
      id: number;
      name: string;
      translationLimit?: number;
      includedMtCredits?: number;
      monthlyPrice: number;
      yearlyPrice: number;
      currentPeriodEnd?: number;
      cancelAtPeriodEnd: boolean;
      currentBillingPeriod?: "MONTHLY" | "YEARLY";
      free: boolean;
    };
    UpdateSubscriptionPrepareRequest: {
      /** Id of the subscription plan */
      planId: number;
      period: "MONTHLY" | "YEARLY";
    };
    SubscriptionUpdatePreviewItem: {
      description: string;
      amount: number;
      taxRate: number;
    };
    SubscriptionUpdatePreviewModel: {
      items: components["schemas"]["SubscriptionUpdatePreviewItem"][];
      total: number;
      amountDue: number;
      updateToken: string;
      prorationDate: number;
      endingBalance: number;
    };
    SubscribeRequest: {
      /** Id of the subscription plan */
      planId: number;
      period: "MONTHLY" | "YEARLY";
    };
    SubscribeModel: {
      url: string;
    };
    BuyMoreCreditsRequest: {
      priceId: number;
      amount: number;
    };
    BuyMoreCreditsModel: {
      url: string;
    };
    CollectionModelPlanModel: {
      _embedded?: {
        plans?: components["schemas"]["PlanModel"][];
      };
    };
    PlanModel: {
      id: number;
      name: string;
      translationLimit?: number;
      includedMtCredits?: number;
      monthlyPrice: number;
      yearlyPrice: number;
      free: boolean;
    };
    InvoiceModel: {
      id: number;
      /** The number on the invoice */
      number: string;
      createdAt: number;
      /** The Total amount with tax */
      total: number;
      /** Whether pdf is ready to download. If not, wait around few minutes until it's generated. */
      pdfReady: boolean;
    };
    PageMetadata: {
      size?: number;
      totalElements?: number;
      totalPages?: number;
      number?: number;
    };
    PagedModelInvoiceModel: {
      _embedded?: {
        invoices?: components["schemas"]["InvoiceModel"][];
      };
      page?: components["schemas"]["PageMetadata"];
    };
    GoToCustomerPortalModel: {
      url: string;
    };
    CollectionModelMtCreditsPriceModel: {
      _embedded?: {
        prices?: components["schemas"]["MtCreditsPriceModel"][];
      };
    };
    MtCreditsPriceModel: {
      id: number;
      price: number;
      amount: number;
    };
  };
}

export interface operations {
  /** Updates subscription */
  updateSubscription: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateSubscriptionRequest"];
      };
    };
  };
  /** Refreshes organizations subscription by Stripe data */
  refresh: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["ActivePlanModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  /** Prepares update subscription session */
  prepareUpdateSubscription: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["SubscriptionUpdatePreviewModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UpdateSubscriptionPrepareRequest"];
      };
    };
  };
  /** Cancels subscription */
  cancelSubscription: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: unknown;
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  webhook: {
    parameters: {
      header: {
        "Stripe-Signature"?: string;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": string;
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
    requestBody: {
      content: {
        "application/json": string;
      };
    };
  };
  /** Returns url of Stripe checkout session */
  subscribe: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["SubscribeModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["SubscribeRequest"];
      };
    };
  };
  /** Returns url of Stripe checkout session to buy more credits */
  getBuyMoreCreditsCheckoutSessionUrl: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["BuyMoreCreditsModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["BuyMoreCreditsRequest"];
      };
    };
  };
  getPlans: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["CollectionModelPlanModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  /** Returns organization invoices */
  getInvoicePdf: {
    parameters: {
      path: {
        organizationId: number;
        invoiceId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "application/pdf": string;
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  /** Returns organization invoices */
  getInvoices: {
    parameters: {
      path: {
        organizationId: number;
      };
      query: {
        /** Zero-based page index (0..N) */
        page?: number;
        /** The size of the page to be returned */
        size?: number;
        /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["PagedModelInvoiceModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  /** Returns url of Stripe customer portal session */
  goToCustomerPortal: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["GoToCustomerPortalModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  /** Refreshes organizations subscription by Stripe data */
  getActivePlan: {
    parameters: {
      path: {
        organizationId: number;
      };
    };
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["ActivePlanModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  getPlans_1: {
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["CollectionModelPlanModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
  getMtCreditPrices: {
    responses: {
      /** OK */
      200: {
        content: {
          "*/*": components["schemas"]["CollectionModelMtCreditsPriceModel"];
        };
      };
      /** Bad Request */
      400: {
        content: {
          "*/*": string;
        };
      };
      /** Not Found */
      404: {
        content: {
          "*/*": string;
        };
      };
    };
  };
}

export interface external {}
