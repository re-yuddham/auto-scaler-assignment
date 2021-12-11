const axios = require("axios");
const uuid = require("uuid");

const apiUrl =
  "https://auto-scale-simulator.cfapps.sap.hana.ondemand.com/requests/";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtleS1pZC0wIiwiamt1IjoiaHR0cHM6Ly9sb2NhbGhvc3Q6OTAwMC90b2tlbl9rZXlzIn0.eyJhdWQiOlsidGVzdC1jbGllbnRpZCFiMTIzIl0sImNpZCI6InNiLTdmZDg2ZjE1LTIzNTctNGYwMi1iNTQ2LTM0Mzc2ZDczZWQwNiFiMDAwfHRlc3QtY2xpZW50aWQhYjEyMyIsImNsaWVudF9pZCI6InNiLTdmZDg2ZjE1LTIzNTctNGYwMi1iNTQ2LTM0Mzc2ZDczZWQwNiFiMDAwfHRlc3QtY2xpZW50aWQhYjEyMyIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJzY29wZSI6WyJ0ZXN0LWNsaWVudGlkIWIxMjMucmVhZCIsInRlc3QtY2xpZW50aWQhYjEyMy5Qcm9kdWN0LlJlYWQiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuUHJvZHVjdC5Xcml0ZSIsInRlc3QtY2xpZW50aWQhYjEyMy5FeHRlbmRDRFMiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuRXh0ZW5kQ0RTZGVsZXRlIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5CUC5SZWFkIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5CUC5Xcml0ZSIsInRlc3QtY2xpZW50aWQhYjEyMy5NRE0uQlBSZWwuUmVhZCIsInRlc3QtY2xpZW50aWQhYjEyMy5NRE0uQlBSZWwuV3JpdGUiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQS00uUmVhZCIsInRlc3QtY2xpZW50aWQhYjEyMy5NRE0uQlAuUmVwIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5CUFJlbC5SZXAiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQS00uUmVwIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5CUERlbGV0ZWQuUmVhZCIsInRlc3QtY2xpZW50aWQhYjEyMy5NRE0uQlBCbG9ja2VkLlJlYWQiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQLkRSTSIsInRlc3QtY2xpZW50aWQhYjEyMy5NRE0uQlAuQmxvY2siLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkNvbmZpZy5SZWFkIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5Db25maWcuV3JpdGUiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuU3Vic2NyaXB0aW9uQ2FsbGJhY2siLCJ0ZXN0LWNsaWVudGlkIWIxMjMuU2NoZW1hVXBncmFkZSIsInRlc3QtY2xpZW50aWQhYjEyMy5NREkuU2VydmljZSIsInRlc3QtY2xpZW50aWQhYjEyMy5EYXRhUHJpdmFjeVRlY2huaWNhbFVzZXIiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQLlNlbnNpdGl2ZURhdGFSZWFkIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5CUC5TZW5zaXRpdmVEYXRhV3JpdGUiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQLkNvbW1vblJlYWQiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQLkNvbW1vbldyaXRlIiwidGVzdC1jbGllbnRpZCFiMTIzLk1ETS5CUC5DdXN0b21lclJlYWQiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQLkN1c3RvbWVyV3JpdGUiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuTURNLkJQLlN1cHBsaWVyUmVhZCIsInRlc3QtY2xpZW50aWQhYjEyMy5NRE0uQlAuU3VwcGxpZXJXcml0ZSIsInRlc3QtY2xpZW50aWQhYjEyMy5TeXN0ZW1zLlJlYWQiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuRmlsdGVyLldyaXRlIiwidGVzdC1jbGllbnRpZCFiMTIzLkZpbHRlci5EZWxldGUiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuRXh0ZW5zaW9ucy5SZWFkIiwidGVzdC1jbGllbnRpZCFiMTIzLkV4dGVuc2lvbnMuV3JpdGUiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuQlBDb21tb25SZWFkIiwidGVzdC1jbGllbnRpZCFiMTIzLkJQU2Vuc2l0aXZlRGF0YVJlYWQiLCJ0ZXN0LWNsaWVudGlkIWIxMjMuQlBHZW5lcmljQ29uZmlnUmVhZCIsInRlc3QtY2xpZW50aWQhYjEyMy5CUEdlbmVyaWNDb25maWdXcml0ZSIsInRlc3QtY2xpZW50aWQhYjEyMy5QU0dlbmVyaWNDb25maWdSZWFkIiwidGVzdC1jbGllbnRpZCFiMTIzLlBTR2VuZXJpY0NvbmZpZ1dyaXRlIiwidWFhLnJlc291cmNlIiwidGVzdC1jbGllbnRpZCFiMTIzLkJhY2t1cE1ldHJpY3MiXSwiemlkIjoiMDhiY2QzNDAtNTg0Yy00MzM4LTlmNmQtNzM0Zjc4ZWJiOGM4IiwiZXhwIjoyMTQ3NDgzNjQ3LCJleHRfYXR0ciI6eyJ6ZG4iOiJ0ZXN0LXN1YmRvbWFpbiIsInNlcnZpY2VpbnN0YW5jZWlkIjoiN2ZkODZmMTUtMjM1Ny00ZjAyLWI1NDYtMzQzNzZkNzNlZDA2IiwiZW5oYW5jZXIiOiJYU1VBQSIsInN1YmFjY291bnRpZCI6IjhkZGRlMzAxLWZiYTgtNGFiOC04MGY5LTZkMzVjN2JmNTYzNyJ9LCJpYXQiOjE2Mzg5NDc4MzZ9.SmqGoCLqdM5-57HX9siHAEG-7F4poRMHaCj1U95vE89KfR8d-OkeLe7_JOrduRprCQ5drPqfNqXi-6A8pb6XO2MzoOUiFJC1yIt7JdBAj2W8rPYAO-YREH9yZPDbJyVDrcuiz2mBrFAL0plrwkXaWsf_wExa269Yq9ZxXIfYKkXjvjjS1-A_mwxXZOqmt17qtvUrwmHEmoLbQ9F_Rq_dEbEM1G5B5lVBZCKAO8xDKsKmwHYW_ZMc8JCvaLFmKELkN6il-5xZgRji_DBhObsYC320ARoawgFNDUXk30wzqwXy8XzbO-mmAAaaLy3Htlh3LBML_hocrHjphphPCkf1Sw";

const totalRequests = 20;

const postToChangeApi = async () => {
  /*const changeToken = uuid.v4();
  const randomId = uuid.v4();
  const displayName = uuid.v4();
  const data = JSON.stringify({
    changeToken: `${changeToken}`,
    operation: "create",
    localIds: [
      {
        context: {
          application: "concur",
          tenant: "MDIPSSRV",
          type: "sap.odm.product.Product",
          additionalContext: "sap.oitc.929",
        },
        status: "active",
        localId: `${randomId}`,
      },
      {
        context: {
          application: "concur",
          tenant: "MDIPSSRV",
          type: "sap.odm.product.Product",
          additionalContext: "sap.oitc.20",
        },
        status: "active",
        localId: `${displayName}`,
      },
      {
        context: {
          application: "concur",
          tenant: "ER9_001",
          type: "sap.odm.product.Product",
          additionalContext: "sap.oitc.929",
        },
        status: "active",
        localId: `${randomId}`,
      },
      {
        context: {
          application: "concur",
          tenant: "ER9_001",
          type: "sap.odm.product.Product",
          additionalContext: "sap.oitc.20",
        },
        status: "active",
        localId: `${displayName}`,
      },
    ],
    instance: {
      id: `${randomId}`,
      displayId: `${displayName}`,
      isApprovedBatchRecordRequired: false,
      isConfigurable: false,
      type: {
        code: "FERT",
      },
      plants: [
        {
          availabilityCheckType: {
            code: "41",
          },
          distributionProfile: {
            code: "ydy",
          },
          isNegativeStockAllowed: true,
          productLogisticsHandlingGroup: {
            code: "muo2",
          },
          id: "en98",
          isBatchManagementRequired: true,
          isMarkedForDeletion: true,
          serialNumberProfile: {
            code: "xf1g",
          },
          productStatus: {
            code: "39",
          },
          productStatusStartDate: "2021-04-26",
          profitCenterLocalIdS4: "ysvx561h22",
        },
        {
          availabilityCheckType: {
            code: "fo",
          },
          distributionProfile: {
            code: "gvb",
          },
          isNegativeStockAllowed: true,
          productLogisticsHandlingGroup: {
            code: "3rt4",
          },
          id: "c9i8",
          isBatchManagementRequired: true,
          isMarkedForDeletion: false,
          serialNumberProfile: {
            code: "hru3",
          },
          productStatus: {
            code: "6j",
          },
          productStatusStartDate: "2021-02-07",
          profitCenterLocalIdS4: "ua9bpxh6mp",
        },
        {
          availabilityCheckType: {
            code: "cz",
          },
          distributionProfile: {
            code: "sd7",
          },
          isNegativeStockAllowed: true,
          productLogisticsHandlingGroup: {
            code: "ubn2",
          },
          id: "627l",
          isBatchManagementRequired: true,
          isMarkedForDeletion: true,
          serialNumberProfile: {
            code: "5ykh",
          },
          productStatus: {
            code: "bx",
          },
          productStatusStartDate: "2020-11-06",
          profitCenterLocalIdS4: "bhsj4ey534",
        },
        {
          availabilityCheckType: {
            code: "5d",
          },
          distributionProfile: {
            code: "d6n",
          },
          isNegativeStockAllowed: false,
          productLogisticsHandlingGroup: {
            code: "wfc9",
          },
          id: "8rki",
          isBatchManagementRequired: false,
          isMarkedForDeletion: true,
          serialNumberProfile: {
            code: "dtfa",
          },
          productStatus: {
            code: "tt",
          },
          productStatusStartDate: "2020-08-10",
          profitCenterLocalIdS4: "6vp29pogrm",
        },
      ],
    },
  });
  const config = {
    method: "post",
    url: apiUrl,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data,
  };*/

  for (let i = 0; i < 6; i++) {
    let url = apiUrl + `${i}/200`;
    const config = {
      method: "get",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    try {
      await axios(config);
    } catch (e) {
      console.log(`error ${i}`);
    }
    console.log(`${i}`);
  }
};

(async () => {
  for (var i = 0; i < 1; i++) {
    const response = await postToChangeApi();

    if (response.status != 202) {
      console.log(`error ${i}`);
      console.log(response);
      break;
    } else {
      console.log(`success ${i}`);
    }
  }
  console.log(`finished up ${totalRequests} requests`);
})();
