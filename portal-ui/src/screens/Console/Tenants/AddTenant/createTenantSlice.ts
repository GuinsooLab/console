// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 GuinsooLab, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getLimitSizes,
  IQuotaElement,
  KeyPair,
  Opts,
} from "../ListTenants/utils";
import {
  ITolerationEffect,
  ITolerationModel,
  ITolerationOperator,
} from "../../../../common/types";
import { ICertificatesItems, IFieldStore, LabelKeyPair } from "../types";
import { getRandomString } from "../utils";
import { has } from "lodash";
import get from "lodash/get";
import {
  IMkEnvs,
  IntegrationConfiguration,
  mkPanelConfigurations,
  resourcesConfigurations,
} from "./Steps/TenantResources/utils";
import { getBytesNumber } from "../../../../common/utils";
import { CertificateFile, FileValue, KeyFileValue } from "../tenantsSlice";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import { createTenantAsync } from "./thunks/createTenantThunk";
import { commonFormValidation } from "../../../../utils/validationFunctions";
import { flipValidPageInState } from "./sliceUtils";
import {
  createNamespaceAsync,
  namespaceResourcesAsync,
  validateNamespaceAsync,
} from "./thunks/namespaceThunks";

export interface ICreateTenant {
  addingTenant: boolean;
  page: number;
  validPages: string[];
  validationErrors: { [key: string]: string };
  storageClasses: Opts[];
  limitSize: any;
  fields: IFieldStore;
  certificates: ICertificatesItems;
  nodeSelectorPairs: LabelKeyPair[];
  tolerations: ITolerationModel[];
  // after creation states
  createdAccount: NewServiceAccount | null;
  showNewCredentials: boolean;
  //namespace logic
  emptyNamespace: boolean;
  loadingNamespaceInfo: boolean;
  showNSCreateButton: boolean;
  addNSOpen: boolean;
  addNSLoading: boolean;
}

const initialState: ICreateTenant = {
  addingTenant: false,
  page: 0,
  // We can assume all the other pages are valid with default configuration except for 'nameTenant'
  // because the user still have to choose a namespace and a name for the tenant
  validPages: [
    "tenantSize",
    "configure",
    "affinity",
    "identityProvider",
    "security",
    "encryption",
  ],
  validationErrors: {},
  storageClasses: [],
  limitSize: {},
  fields: {
    nameTenant: {
      tenantName: "",
      namespace: "",
      selectedStorageClass: "",
      selectedStorageType: "",
    },
    configure: {
      customImage: true,
      imageName: "",
      customDockerhub: false,
      imageRegistry: "",
      imageRegistryUsername: "",
      imageRegistryPassword: "",
      exposeMinIO: true,
      exposeConsole: true,
      tenantCustom: false,
      logSearchEnabled: true,
      prometheusEnabled: true,
      logSearchVolumeSize: "5",
      logSearchSizeFactor: "Gi",
      logSearchImage: "",
      kesImage: "",
      logSearchPostgresImage: "",
      logSearchPostgresInitImage: "",
      prometheusVolumeSize: "5",
      prometheusSizeFactor: "Gi",
      logSearchSelectedStorageClass: "default",
      prometheusSelectedStorageClass: "default",
      prometheusImage: "",
      prometheusSidecarImage: "",
      prometheusInitImage: "",
      setDomains: false,
      consoleDomain: "",
      minioDomains: [""],
      tenantSecurityContext: {
        runAsUser: "1000",
        runAsGroup: "1000",
        fsGroup: "1000",
        runAsNonRoot: true,
      },
      logSearchSecurityContext: {
        runAsUser: "1000",
        runAsGroup: "1000",
        fsGroup: "1000",
        runAsNonRoot: true,
      },
      logSearchPostgresSecurityContext: {
        runAsUser: "999",
        runAsGroup: "999",
        fsGroup: "999",
        runAsNonRoot: true,
      },
      prometheusSecurityContext: {
        runAsUser: "1000",
        runAsGroup: "1000",
        fsGroup: "1000",
        runAsNonRoot: true,
      },
    },
    identityProvider: {
      idpSelection: "Built-in",
      accessKeys: [getRandomString(16)],
      secretKeys: [getRandomString(32)],
      openIDConfigurationURL: "",
      openIDClientID: "",
      openIDSecretID: "",
      openIDCallbackURL: "",
      openIDClaimName: "",
      openIDScopes: "",
      ADURL: "",
      ADSkipTLS: false,
      ADServerInsecure: false,
      ADGroupSearchBaseDN: "",
      ADGroupSearchFilter: "",
      ADUserDNs: [""],
      ADLookupBindDN: "",
      ADLookupBindPassword: "",
      ADUserDNSearchBaseDN: "",
      ADUserDNSearchFilter: "",
      ADServerStartTLS: false,
    },
    security: {
      enableAutoCert: true,
      enableCustomCerts: false,
      enableTLS: true,
    },
    encryption: {
      enableEncryption: false,
      encryptionType: "vault",
      gemaltoEndpoint: "",
      gemaltoToken: "",
      gemaltoDomain: "",
      gemaltoRetry: "0",
      awsEndpoint: "",
      awsRegion: "",
      awsKMSKey: "",
      awsAccessKey: "",
      awsSecretKey: "",
      awsToken: "",
      vaultEndpoint: "",
      vaultEngine: "",
      vaultNamespace: "",
      vaultPrefix: "",
      vaultAppRoleEngine: "",
      vaultId: "",
      vaultSecret: "",
      vaultRetry: "0",
      vaultPing: "0",
      azureEndpoint: "",
      azureTenantID: "",
      azureClientID: "",
      azureClientSecret: "",
      gcpProjectID: "",
      gcpEndpoint: "",
      gcpClientEmail: "",
      gcpClientID: "",
      gcpPrivateKeyID: "",
      gcpPrivateKey: "",
      enableCustomCertsForKES: false,
      replicas: "1",
      kesSecurityContext: {
        runAsUser: "1000",
        runAsGroup: "1000",
        fsGroup: "1000",
        runAsNonRoot: true,
      },
    },
    tenantSize: {
      volumeSize: "1024",
      sizeFactor: "Gi",
      drivesPerServer: "4",
      nodes: "4",
      memoryNode: "2",
      ecParity: "",
      ecParityChoices: [],
      cleanECChoices: [],
      untouchedECField: true,
      cpuToUse: "0",
      // resource request
      resourcesSpecifyLimit: false,
      resourcesCPURequestError: "",
      resourcesCPURequest: "",
      resourcesCPULimitError: "",
      resourcesCPULimit: "",
      resourcesMemoryRequestError: "",
      resourcesMemoryRequest: "",
      resourcesMemoryLimitError: "",
      resourcesMemoryLimit: "",
      resourcesSize: {
        error: "",
        memoryRequest: 0,
        memoryLimit: 0,
        cpuRequest: 0,
        cpuLimit: 0,
      },
      distribution: {
        error: "",
        nodes: 0,
        persistentVolumes: 0,
        disks: 0,
      },
      ecParityCalc: {
        error: 0,
        defaultEC: "",
        erasureCodeSet: 0,
        maxEC: "",
        rawCapacity: "0",
        storageFactors: [],
      },
      limitSize: {},
      maxAllocatableResources: {
        min_allocatable_mem: 0,
        min_allocatable_cpu: 0,
        cpu_priority: {
          max_allocatable_cpu: 0,
          max_allocatable_mem: 0,
        },
        mem_priority: {
          max_allocatable_cpu: 0,
          max_allocatable_mem: 0,
        },
      },
      maxCPUsUse: "0",
      maxMemorySize: "0",
      integrationSelection: {
        driveSize: { driveSize: "0", sizeUnit: "B" },
        CPU: 0,
        typeSelection: "",
        memory: 0,
        drivesPerServer: 0,
        storageClass: "",
      },
    },
    affinity: {
      nodeSelectorLabels: "",
      podAffinity: "default",
      withPodAntiAffinity: true,
    },
  },
  certificates: {
    minioCertificates: [
      {
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
    ],
    caCertificates: [
      {
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
    ],
    consoleCaCertificates: [
      {
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
    ],
    consoleCertificate: {
      id: "console_cert_pair",
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
    serverCertificate: {
      id: "encryptionServerCertificate",
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
    clientCertificate: {
      id: "encryptionClientCertificate",
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
    vaultCertificate: {
      id: "encryptionVaultCertificate",
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
    vaultCA: {
      id: "encryptionVaultCA",
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
    gemaltoCA: {
      id: "encryptionGemaltoCA",
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
  },
  nodeSelectorPairs: [{ key: "", value: "" }],
  tolerations: [
    {
      key: "",
      tolerationSeconds: { seconds: 0 },
      value: "",
      effect: ITolerationEffect.NoSchedule,
      operator: ITolerationOperator.Equal,
    },
  ],
  createdAccount: null,
  showNewCredentials: false,
  emptyNamespace: true,
  loadingNamespaceInfo: false,
  showNSCreateButton: false,
  addNSOpen: false,
  addNSLoading: false,
};

export const createTenantSlice = createSlice({
  name: "createTenant",
  initialState,
  reducers: {
    setTenantWizardPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    updateAddField: (
      state,
      action: PayloadAction<{
        pageName: keyof IFieldStore;
        field: string;
        value: any;
      }>
    ) => {
      if (
        has(state.fields, `${action.payload.pageName}.${action.payload.field}`)
      ) {
        const originPageNameItems = get(
          state.fields,
          `${action.payload.pageName}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        state.fields[action.payload.pageName] = { ...joinValue };
      }
    },
    isPageValid: (
      state,
      action: PayloadAction<{
        pageName: keyof IFieldStore;
        valid: boolean;
      }>
    ) => {
      let originValidPages = state.validPages;
      if (action.payload.valid) {
        if (!originValidPages.includes(action.payload.pageName)) {
          originValidPages.push(action.payload.pageName);

          state.validPages = [...originValidPages];
        }
      } else {
        const newSetOfPages = originValidPages.filter(
          (elm) => elm !== action.payload.pageName
        );
        state.validPages = [...newSetOfPages];
      }
    },
    setStorageClassesList: (state, action: PayloadAction<Opts[]>) => {
      state.storageClasses = action.payload;
    },
    setStorageType: (
      state,
      action: PayloadAction<{
        storageType: string;
        features?: string[];
      }>
    ) => {
      let size = state.fields.tenantSize.volumeSize;
      let sizeFactor = state.fields.tenantSize.sizeFactor;
      let volumeSize = state.fields.tenantSize.volumeSize;
      let selectedStorageClass = state.fields.nameTenant.selectedStorageClass;
      // for the aws marketplace integration we have some constraints
      // on the minimum cluster size

      if (
        action.payload.features !== undefined &&
        action.payload.features.length > 0
      ) {
        let formToRender = IMkEnvs.default;
        const possibleVariables = Object.keys(resourcesConfigurations);

        possibleVariables.forEach((element) => {
          if (
            action.payload.features !== undefined &&
            action.payload.features.includes(element)
          ) {
            formToRender = get(
              resourcesConfigurations,
              element,
              IMkEnvs.default
            );
          }
        });

        // if the size is less than the minimum for the selected storage type
        // we will override the current total storage entered amount with the minimum
        if (formToRender !== undefined) {
          const setConfigs = mkPanelConfigurations[formToRender];
          const keyCount = Object.keys(setConfigs).length;

          //Configuration is filled
          if (keyCount > 0) {
            const configs: IntegrationConfiguration[] = get(
              setConfigs,
              "configurations",
              []
            );
            const mainSelection = configs.find(
              (item) => item.typeSelection === action.payload.storageType
            );
            if (mainSelection !== undefined) {
              // store the selected storage class
              selectedStorageClass = mainSelection.storageClass;
              if (mainSelection.minimumVolumeSize) {
                const minimumSize = getBytesNumber(
                  mainSelection.minimumVolumeSize?.driveSize,
                  mainSelection.minimumVolumeSize?.sizeUnit,
                  true
                );

                const drivesPerServer = state.fields.tenantSize.drivesPerServer;
                const nodes = state.fields.tenantSize.drivesPerServer;

                const currentSize = getBytesNumber(
                  size.toString(),
                  sizeFactor,
                  true
                );
                if (currentSize < minimumSize) {
                  // size = minimumSize.toString(10);
                  const totalSize =
                    parseInt(nodes) *
                    parseInt(drivesPerServer) *
                    parseInt(mainSelection.minimumVolumeSize.driveSize);

                  volumeSize = totalSize.toString(10);
                  sizeFactor = mainSelection.minimumVolumeSize.sizeUnit;
                }
              }
            }
          }
        }
      }

      state.fields.nameTenant.selectedStorageType = action.payload.storageType;
      state.fields.nameTenant.selectedStorageClass = selectedStorageClass;

      // left intentionally here since the original reducer had it
      // state.fields.tenantSize.size = size;
      state.fields.tenantSize.volumeSize = volumeSize;
      state.fields.tenantSize.sizeFactor = sizeFactor;
    },
    setLimitSize: (state, action: PayloadAction<any>) => {
      state.limitSize = action.payload;
    },
    addKeyPair: (state) => {
      const minioCerts = [
        ...state.certificates.minioCertificates,
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ];
      state.certificates.minioCertificates = [...minioCerts];
    },
    addFileToKeyPair: (state, action: PayloadAction<CertificateFile>) => {
      const minioCertificates = state.certificates.minioCertificates;

      const NCertList = minioCertificates.map((item: KeyPair) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            [action.payload.key]: action.payload.fileName,
            [`encoded_${action.payload.key}`]: action.payload.value,
          };
        }
        return item;
      });
      state.certificates.minioCertificates = [...NCertList];
    },
    deleteKeyPair: (state, action: PayloadAction<string>) => {
      const minioCertsList = state.certificates.minioCertificates;

      if (minioCertsList.length > 1) {
        state.certificates.minioCertificates = minioCertsList.filter(
          (item: KeyPair) => item.id !== action.payload
        );
      }
    },
    addCaCertificate: (state) => {
      state.certificates.caCertificates.push({
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      });
    },
    addFileToCaCertificates: (
      state,
      action: PayloadAction<CertificateFile>
    ) => {
      const caCertificates = state.certificates.caCertificates;

      const NACList = caCertificates.map((item: KeyPair) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            [action.payload.key]: action.payload.fileName,
            [`encoded_${action.payload.key}`]: action.payload.value,
          };
        }
        return item;
      });
      state.certificates.caCertificates = NACList;
    },
    deleteCaCertificate: (state, action: PayloadAction<string>) => {
      const CACertsList = state.certificates.caCertificates;
      if (CACertsList.length > 1) {
        const cleanCaCertsList = CACertsList.filter(
          (item: KeyPair) => item.id !== action.payload
        );
        state.certificates.caCertificates = cleanCaCertsList;
      }
    },
    addConsoleCertificate: (state, action: PayloadAction<CertificateFile>) => {
      const consoleCert = state.certificates.consoleCertificate;
      state.certificates.consoleCertificate = {
        ...consoleCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addConsoleCaCertificate: (state) => {
      state.certificates.consoleCaCertificates.push({
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      });
    },
    addFileToConsoleCaCertificates: (
      state,
      action: PayloadAction<CertificateFile>
    ) => {
      const consoleCaCertificates = state.certificates.consoleCaCertificates;

      state.certificates.consoleCaCertificates = consoleCaCertificates.map(
        (item: KeyPair) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              [action.payload.key]: action.payload.fileName,
              [`encoded_${action.payload.key}`]: action.payload.value,
            };
          }
          return item;
        }
      );
    },
    deleteConsoleCaCertificate: (state, action: PayloadAction<string>) => {
      const consoleCACertsList = state.certificates.consoleCaCertificates;
      if (consoleCACertsList.length > 1) {
        state.certificates.consoleCaCertificates = consoleCACertsList.filter(
          (item: KeyPair) => item.id !== action.payload
        );
      }
    },
    addFileServerCert: (state, action: PayloadAction<KeyFileValue>) => {
      const encServerCert = state.certificates.serverCertificate;

      state.certificates.serverCertificate = {
        ...encServerCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addFileClientCert: (state, action: PayloadAction<KeyFileValue>) => {
      const encClientCert = state.certificates.clientCertificate;

      state.certificates.clientCertificate = {
        ...encClientCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addFileVaultCert: (state, action: PayloadAction<KeyFileValue>) => {
      const encVaultCert = state.certificates.vaultCertificate;

      state.certificates.vaultCertificate = {
        ...encVaultCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addFileVaultCa: (state, action: PayloadAction<FileValue>) => {
      const encVaultCA = state.certificates.vaultCA;

      state.certificates.vaultCA = {
        ...encVaultCA,
        cert: action.payload.fileName,
        encoded_cert: action.payload.value,
      };
    },
    addFileGemaltoCa: (state, action: PayloadAction<FileValue>) => {
      const encGemaltoCA = state.certificates.gemaltoCA;

      state.certificates.gemaltoCA = {
        ...encGemaltoCA,
        cert: action.payload.fileName,
        encoded_cert: action.payload.value,
      };
    },
    resetAddTenantForm: () => initialState,
    setKeyValuePairs: (state, action: PayloadAction<LabelKeyPair[]>) => {
      state.nodeSelectorPairs = action.payload;
    },
    setTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      state.tolerations[action.payload.index] = action.payload.tolerationValue;
    },
    addNewToleration: (state) => {
      const newTolerationArray = [
        ...state.tolerations,
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ];
      state.tolerations = newTolerationArray;
    },
    removeToleration: (state, action: PayloadAction<number>) => {
      state.tolerations = state.tolerations.filter(
        (_, index) => index !== action.payload
      );
    },
    addNewMinIODomain: (state) => {
      state.fields.configure.minioDomains.push("");
    },
    removeMinIODomain: (state, action: PayloadAction<number>) => {
      state.fields.configure.minioDomains =
        state.fields.configure.minioDomains.filter(
          (_, index) => index !== action.payload
        );
    },
    addIDPNewKeyPair: (state) => {
      state.fields.identityProvider.accessKeys.push(getRandomString(16));
      state.fields.identityProvider.secretKeys.push(getRandomString(32));
    },
    removeIDPKeyPairAtIndex: (state, action: PayloadAction<number>) => {
      if (state.fields.identityProvider.accessKeys.length > action.payload) {
        state.fields.identityProvider.accessKeys.splice(action.payload, 1);
        state.fields.identityProvider.secretKeys.splice(action.payload, 1);
      }
    },
    setIDPUsrAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        accessKey: string;
      }>
    ) => {
      if (
        state.fields.identityProvider.accessKeys.length > action.payload.index
      ) {
        state.fields.identityProvider.accessKeys[action.payload.index] =
          action.payload.accessKey;
      }
    },
    setIDPPwdAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        secretKey: string;
      }>
    ) => {
      if (
        state.fields.identityProvider.secretKeys.length > action.payload.index
      ) {
        state.fields.identityProvider.secretKeys[action.payload.index] =
          action.payload.secretKey;
      }
    },
    addIDPADUsrAtIndex: (state) => {
      state.fields.identityProvider.ADUserDNs.push("");
    },
    removeIDPADUsrAtIndex: (state, action: PayloadAction<number>) => {
      if (state.fields.identityProvider.ADUserDNs.length > action.payload) {
        state.fields.identityProvider.ADUserDNs.splice(action.payload, 1);
      }
    },
    setIDPADUsrAtIndex: (
      state,
      action: PayloadAction<{
        index: number;
        userDN: string;
      }>
    ) => {
      if (
        state.fields.identityProvider.ADUserDNs.length > action.payload.index
      ) {
        state.fields.identityProvider.ADUserDNs[action.payload.index] =
          action.payload.userDN;
      }
    },
    setIDP: (state, action: PayloadAction<string>) => {
      state.fields.identityProvider.idpSelection = action.payload;
    },
    setTenantName: (state, action: PayloadAction<string>) => {
      state.fields.nameTenant.tenantName = action.payload;
      delete state.validationErrors["tenant-name"];

      const commonValidation = commonFormValidation([
        {
          fieldKey: "tenant-name",
          required: true,
          pattern: /^[a-z0-9-]{3,63}$/,
          customPatternMessage:
            "Name only can contain lowercase letters, numbers and '-'. Min. Length: 3",
          value: action.payload,
        },
      ]);

      let isValid = false;
      if ("tenant-name" in commonValidation) {
        isValid = true;
        state.validationErrors["tenant-name"] = commonValidation["tenant-name"];
      }

      flipValidPageInState(state, "nameTenant", isValid);
    },
    setNamespace: (state, action: PayloadAction<string>) => {
      state.fields.nameTenant.namespace = action.payload;
      delete state.validationErrors["namespace"];

      let customNamespaceError = false;
      let errorMessage = "";

      if (
        state.storageClasses.length < 1 &&
        state.emptyNamespace &&
        !state.loadingNamespaceInfo
      ) {
        customNamespaceError = true;
        errorMessage = "Please enter a valid namespace";
      }

      const commonValidation = commonFormValidation([
        {
          fieldKey: "namespace",
          required: true,
          value: action.payload,
          customValidation: customNamespaceError,
          customValidationMessage: errorMessage,
        },
      ]);

      let isValid = false;
      if ("namespace" in commonValidation) {
        isValid = true;
        state.validationErrors["namespace"] = commonValidation["namespace"];
      }

      flipValidPageInState(state, "nameTenant", isValid);
    },
    showNSCreate: (state, action: PayloadAction<boolean>) => {
      state.showNSCreateButton = action.payload;
    },
    openAddNSModal: (state) => {
      state.addNSOpen = true;
    },
    closeAddNSModal: (state) => {
      state.addNSOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTenantAsync.pending, (state, action) => {
        state.addingTenant = true;
        state.createdAccount = null;
        state.showNewCredentials = false;
      })
      .addCase(createTenantAsync.rejected, (state, action) => {
        state.addingTenant = false;
      })
      .addCase(createTenantAsync.fulfilled, (state, action) => {
        state.addingTenant = false;
        state.createdAccount = action.payload;
        state.showNewCredentials = true;
      })
      .addCase(validateNamespaceAsync.pending, (state, action) => {
        state.loadingNamespaceInfo = true;
        state.showNSCreateButton = false;
        delete state.validationErrors["namespace"];
      })
      .addCase(validateNamespaceAsync.rejected, (state, action) => {
        state.loadingNamespaceInfo = false;
        state.showNSCreateButton = true;
      })
      .addCase(validateNamespaceAsync.fulfilled, (state, action) => {
        state.showNSCreateButton = false;
        state.emptyNamespace = action.payload;
        if (!state.emptyNamespace) {
          state.validationErrors["namespace"] =
            "You can only create one tenant per namespace";
        }
      })
      .addCase(namespaceResourcesAsync.pending, (state, action) => {
        state.loadingNamespaceInfo = true;
      })
      .addCase(namespaceResourcesAsync.rejected, (state, action) => {
        state.loadingNamespaceInfo = false;
        state.showNSCreateButton = true;
        state.fields.nameTenant.selectedStorageClass = "";
        state.storageClasses = [];

        state.validationErrors["namespace"] = "Please enter a valid namespace";
      })
      .addCase(namespaceResourcesAsync.fulfilled, (state, action) => {
        state.loadingNamespaceInfo = false;

        const elements: IQuotaElement[] = get(action.payload, "elements", []);
        state.limitSize = getLimitSizes(action.payload!);

        if (elements === null || elements.length === 0) {
          state.validationErrors["namespace"] = "No storage classes available.";
          return;
        }
        const newStorage = elements.map((storageClass: any) => {
          const name = get(storageClass, "name", "").split(
            ".storageclass.storage.k8s.io/requests.storage"
          )[0];

          return { label: name, value: name };
        });

        state.storageClasses = newStorage;
        const stExists = newStorage.findIndex(
          (storageClass) =>
            storageClass.value === state.fields.nameTenant.selectedStorageClass
        );

        if (newStorage.length > 0 && stExists === -1) {
          state.fields.nameTenant.selectedStorageClass = newStorage[0].value;
        } else if (newStorage.length === 0) {
          state.fields.nameTenant.selectedStorageClass = "";
          state.storageClasses = [];
        }
      })
      .addCase(createNamespaceAsync.pending, (state, action) => {
        state.addNSLoading = true;
      })
      .addCase(createNamespaceAsync.rejected, (state, action) => {
        state.addNSLoading = false;
      })
      .addCase(createNamespaceAsync.fulfilled, (state, action) => {
        state.addNSLoading = false;
        state.addNSOpen = false;
        delete state.validationErrors["namespace"];
      });
  },
});

export const {
  setTenantWizardPage,
  updateAddField,
  isPageValid,
  setStorageClassesList,
  setStorageType,
  setLimitSize,
  addCaCertificate,
  deleteCaCertificate,
  addFileToCaCertificates,
  addConsoleCaCertificate,
  deleteConsoleCaCertificate,
  addFileToConsoleCaCertificates,
  addKeyPair,
  deleteKeyPair,
  addFileToKeyPair,
  addConsoleCertificate,
  addFileServerCert,
  addFileClientCert,
  addFileVaultCert,
  addFileVaultCa,
  addFileGemaltoCa,
  resetAddTenantForm,
  setKeyValuePairs,
  setTolerationInfo,
  addNewToleration,
  removeToleration,
  addNewMinIODomain,
  removeMinIODomain,
  addIDPNewKeyPair,
  removeIDPKeyPairAtIndex,
  setIDPUsrAtIndex,
  setIDPPwdAtIndex,
  setIDPADUsrAtIndex,
  addIDPADUsrAtIndex,
  removeIDPADUsrAtIndex,
  setIDP,
  setTenantName,
  setNamespace,
  showNSCreate,
  openAddNSModal,
  closeAddNSModal,
} = createTenantSlice.actions;

export default createTenantSlice.reducer;
