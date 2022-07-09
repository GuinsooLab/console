// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../../../../../store";
import { generatePoolName, getBytes } from "../../../../../common/utils";
import { getDefaultAffinity, getNodeSelector } from "../../TenantDetails/utils";
import { ITenantCreator } from "../../../../../common/types";
import { KeyPair } from "../../ListTenants/utils";
import { createTenantCall } from "../createTenantAPI";
import { setErrorSnackMessage } from "../../../../../systemSlice";

export const createTenantAsync = createAsyncThunk(
  "createTenant/createTenantAsync",
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as AppState;

    let fields = state.createTenant.fields;
    let certificates = state.createTenant.certificates;

    const tenantName = fields.nameTenant.tenantName;
    const selectedStorageClass = fields.nameTenant.selectedStorageClass;
    const imageName = fields.configure.imageName;
    const customDockerhub = fields.configure.customDockerhub;
    const imageRegistry = fields.configure.imageRegistry;
    const imageRegistryUsername = fields.configure.imageRegistryUsername;
    const imageRegistryPassword = fields.configure.imageRegistryPassword;
    const exposeMinIO = fields.configure.exposeMinIO;
    const exposeConsole = fields.configure.exposeConsole;
    const idpSelection = fields.identityProvider.idpSelection;
    const openIDConfigurationURL =
      fields.identityProvider.openIDConfigurationURL;
    const openIDClientID = fields.identityProvider.openIDClientID;
    const openIDClaimName = fields.identityProvider.openIDClaimName;
    const openIDCallbackURL = fields.identityProvider.openIDCallbackURL;
    const openIDScopes = fields.identityProvider.openIDScopes;
    const openIDSecretID = fields.identityProvider.openIDSecretID;
    const ADURL = fields.identityProvider.ADURL;
    const ADSkipTLS = fields.identityProvider.ADSkipTLS;
    const ADServerInsecure = fields.identityProvider.ADServerInsecure;
    const ADGroupSearchBaseDN = fields.identityProvider.ADGroupSearchBaseDN;
    const ADGroupSearchFilter = fields.identityProvider.ADGroupSearchFilter;
    const ADUserDNs = fields.identityProvider.ADUserDNs;
    const ADLookupBindDN = fields.identityProvider.ADLookupBindDN;
    const ADLookupBindPassword = fields.identityProvider.ADLookupBindPassword;
    const ADUserDNSearchBaseDN = fields.identityProvider.ADUserDNSearchBaseDN;
    const ADUserDNSearchFilter = fields.identityProvider.ADUserDNSearchFilter;
    const ADServerStartTLS = fields.identityProvider.ADServerStartTLS;
    const accessKeys = fields.identityProvider.accessKeys;
    const secretKeys = fields.identityProvider.secretKeys;
    const minioCertificates = certificates.minioCertificates;
    const caCertificates = certificates.caCertificates;
    const consoleCaCertificates = certificates.consoleCaCertificates;
    const consoleCertificate = certificates.consoleCertificate;
    const serverCertificate = certificates.serverCertificate;
    const clientCertificate = certificates.clientCertificate;
    const vaultCertificate = certificates.vaultCertificate;
    const vaultCA = certificates.vaultCA;
    const gemaltoCA = certificates.gemaltoCA;
    const enableEncryption = fields.encryption.enableEncryption;
    const encryptionType = fields.encryption.encryptionType;
    const gemaltoEndpoint = fields.encryption.gemaltoEndpoint;
    const gemaltoToken = fields.encryption.gemaltoToken;
    const gemaltoDomain = fields.encryption.gemaltoDomain;
    const gemaltoRetry = fields.encryption.gemaltoRetry;
    const awsEndpoint = fields.encryption.awsEndpoint;
    const awsRegion = fields.encryption.awsRegion;
    const awsKMSKey = fields.encryption.awsKMSKey;
    const awsAccessKey = fields.encryption.awsAccessKey;
    const awsSecretKey = fields.encryption.awsSecretKey;
    const awsToken = fields.encryption.awsToken;
    const vaultEndpoint = fields.encryption.vaultEndpoint;
    const vaultEngine = fields.encryption.vaultEngine;
    const vaultNamespace = fields.encryption.vaultNamespace;
    const vaultPrefix = fields.encryption.vaultPrefix;
    const vaultAppRoleEngine = fields.encryption.vaultAppRoleEngine;
    const vaultId = fields.encryption.vaultId;
    const vaultSecret = fields.encryption.vaultSecret;
    const vaultRetry = fields.encryption.vaultRetry;
    const vaultPing = fields.encryption.vaultPing;
    const azureEndpoint = fields.encryption.azureEndpoint;
    const azureTenantID = fields.encryption.azureTenantID;
    const azureClientID = fields.encryption.azureClientID;
    const azureClientSecret = fields.encryption.azureClientSecret;
    const gcpProjectID = fields.encryption.gcpProjectID;
    const gcpEndpoint = fields.encryption.gcpEndpoint;
    const gcpClientEmail = fields.encryption.gcpClientEmail;
    const gcpClientID = fields.encryption.gcpClientID;
    const gcpPrivateKeyID = fields.encryption.gcpPrivateKeyID;
    const gcpPrivateKey = fields.encryption.gcpPrivateKey;
    const enableAutoCert = fields.security.enableAutoCert;
    const enableTLS = fields.security.enableTLS;
    const ecParity = fields.tenantSize.ecParity;
    const distribution = fields.tenantSize.distribution;
    const tenantCustom = fields.configure.tenantCustom;
    const logSearchEnabled = fields.configure.logSearchEnabled;
    const prometheusEnabled = fields.configure.prometheusEnabled;
    const logSearchVolumeSize = fields.configure.logSearchVolumeSize;
    const logSearchSelectedStorageClass =
      fields.configure.logSearchSelectedStorageClass;
    const logSearchImage = fields.configure.logSearchImage;
    const kesImage = fields.configure.kesImage;
    const logSearchPostgresImage = fields.configure.logSearchPostgresImage;
    const logSearchPostgresInitImage =
      fields.configure.logSearchPostgresInitImage;
    const prometheusImage = fields.configure.prometheusImage;
    const prometheusSidecarImage = fields.configure.prometheusSidecarImage;
    const prometheusInitImage = fields.configure.prometheusInitImage;
    const prometheusSelectedStorageClass =
      fields.configure.prometheusSelectedStorageClass;
    const prometheusVolumeSize = fields.configure.prometheusVolumeSize;
    const affinityType = fields.affinity.podAffinity;
    const nodeSelectorLabels = fields.affinity.nodeSelectorLabels;
    const withPodAntiAffinity = fields.affinity.withPodAntiAffinity;

    const tenantSecurityContext = fields.configure.tenantSecurityContext;
    const logSearchSecurityContext = fields.configure.logSearchSecurityContext;
    const logSearchPostgresSecurityContext =
      fields.configure.logSearchPostgresSecurityContext;
    const prometheusSecurityContext =
      fields.configure.prometheusSecurityContext;
    const kesSecurityContext = fields.encryption.kesSecurityContext;
    const kesReplicas = fields.encryption.replicas;
    const setDomains = fields.configure.setDomains;
    const minioDomains = fields.configure.minioDomains;
    const consoleDomain = fields.configure.consoleDomain;

    let tolerations = state.createTenant.tolerations;
    let namespace = state.createTenant.fields.nameTenant.namespace;

    const tolerationValues = tolerations.filter(
      (toleration) => toleration.key.trim() !== ""
    );

    const poolName = generatePoolName([]);

    let affinityObject = {};

    switch (affinityType) {
      case "default":
        affinityObject = {
          affinity: getDefaultAffinity(tenantName, poolName),
        };
        break;
      case "nodeSelector":
        affinityObject = {
          affinity: getNodeSelector(
            nodeSelectorLabels,
            withPodAntiAffinity,
            tenantName,
            poolName
          ),
        };
        break;
    }

    const erasureCode = ecParity.split(":")[1];

    let dataSend: ITenantCreator = {
      name: tenantName,
      namespace: namespace,
      access_key: "",
      secret_key: "",
      access_keys: [],
      secret_keys: [],
      enable_tls: enableTLS && enableAutoCert,
      enable_console: true,
      enable_prometheus: true,
      service_name: "",
      image: imageName,
      expose_minio: exposeMinIO,
      expose_console: exposeConsole,
      pools: [
        {
          name: poolName,
          servers: distribution.nodes,
          volumes_per_server: distribution.disks,
          volume_configuration: {
            size: distribution.pvSize,
            storage_class_name: selectedStorageClass,
          },
          securityContext: tenantCustom ? tenantSecurityContext : null,
          ...affinityObject,
          tolerations: tolerationValues,
        },
      ],
      erasureCodingParity: parseInt(erasureCode, 10),
    };

    // Set Resources
    if (
      fields.tenantSize.resourcesCPURequest !== "" ||
      fields.tenantSize.resourcesCPULimit !== "" ||
      fields.tenantSize.resourcesMemoryRequest !== "" ||
      fields.tenantSize.resourcesMemoryLimit !== ""
    ) {
      dataSend.pools[0].resources = {};
      // requests
      if (
        fields.tenantSize.resourcesCPURequest !== "" ||
        fields.tenantSize.resourcesMemoryRequest !== ""
      ) {
        dataSend.pools[0].resources.requests = {};
        if (fields.tenantSize.resourcesCPURequest !== "") {
          dataSend.pools[0].resources.requests.cpu = parseInt(
            fields.tenantSize.resourcesCPURequest
          );
        }
        if (fields.tenantSize.resourcesMemoryRequest !== "") {
          dataSend.pools[0].resources.requests.memory = parseInt(
            getBytes(fields.tenantSize.resourcesMemoryRequest, "Gi", true)
          );
        }
      }
      // limits
      if (
        fields.tenantSize.resourcesCPULimit !== "" ||
        fields.tenantSize.resourcesMemoryLimit !== ""
      ) {
        dataSend.pools[0].resources.limits = {};
        if (fields.tenantSize.resourcesCPULimit !== "") {
          dataSend.pools[0].resources.limits.cpu = parseInt(
            fields.tenantSize.resourcesCPULimit
          );
        }
        if (fields.tenantSize.resourcesMemoryLimit !== "") {
          dataSend.pools[0].resources.limits.memory = parseInt(
            getBytes(fields.tenantSize.resourcesMemoryLimit, "Gi", true)
          );
        }
      }
    }
    if (customDockerhub) {
      dataSend = {
        ...dataSend,
        image_registry: {
          registry: imageRegistry,
          username: imageRegistryUsername,
          password: imageRegistryPassword,
        },
      };
    }

    if (logSearchEnabled) {
      dataSend = {
        ...dataSend,
        logSearchConfiguration: {
          storageClass:
            logSearchSelectedStorageClass === "default"
              ? ""
              : logSearchSelectedStorageClass,
          storageSize: parseInt(logSearchVolumeSize),
          image: logSearchImage,
          postgres_image: logSearchPostgresImage,
          postgres_init_image: logSearchPostgresInitImage,
          securityContext: logSearchSecurityContext,
          postgres_securityContext: logSearchPostgresSecurityContext,
        },
      };
    }

    if (prometheusEnabled) {
      dataSend = {
        ...dataSend,
        prometheusConfiguration: {
          storageClass:
            prometheusSelectedStorageClass === "default"
              ? ""
              : prometheusSelectedStorageClass,
          storageSize: parseInt(prometheusVolumeSize),
          image: prometheusImage,
          sidecar_image: prometheusSidecarImage,
          init_image: prometheusInitImage,
          securityContext: prometheusSecurityContext,
        },
      };
    }

    let tenantCerts: any = null;
    let consoleCerts: any = null;
    let caCerts: any = null;
    let consoleCaCerts: any = null;

    if (caCertificates.length > 0) {
      caCerts = {
        ca_certificates: caCertificates
          .map((keyPair: KeyPair) => keyPair.encoded_cert)
          .filter((keyPair) => keyPair),
      };
    }

    if (consoleCaCertificates.length > 0) {
      consoleCaCerts = {
        console_ca_certificates: consoleCaCertificates
          .map((keyPair: KeyPair) => keyPair.encoded_cert)
          .filter((keyPair) => keyPair),
      };
    }

    if (enableTLS && minioCertificates.length > 0) {
      tenantCerts = {
        minio: minioCertificates
          .map((keyPair: KeyPair) => ({
            crt: keyPair.encoded_cert,
            key: keyPair.encoded_key,
          }))
          .filter((keyPair) => keyPair.crt && keyPair.key),
      };
    }

    if (
      enableTLS &&
      consoleCertificate.encoded_cert !== "" &&
      consoleCertificate.encoded_key !== ""
    ) {
      consoleCerts = {
        console: {
          crt: consoleCertificate.encoded_cert,
          key: consoleCertificate.encoded_key,
        },
      };
    }

    if (tenantCerts || consoleCerts || caCerts || consoleCaCerts) {
      dataSend = {
        ...dataSend,
        tls: {
          ...tenantCerts,
          ...consoleCerts,
          ...caCerts,
          ...consoleCaCerts,
        },
      };
    }

    if (enableEncryption) {
      let insertEncrypt = {};

      switch (encryptionType) {
        case "gemalto":
          let gemaltoCAIntroduce = {};

          if (gemaltoCA.encoded_cert !== "") {
            gemaltoCAIntroduce = {
              ca: gemaltoCA.encoded_cert,
            };
          }
          insertEncrypt = {
            gemalto: {
              keysecure: {
                endpoint: gemaltoEndpoint,
                credentials: {
                  token: gemaltoToken,
                  domain: gemaltoDomain,
                  retry: parseInt(gemaltoRetry),
                },
                tls: {
                  ...gemaltoCAIntroduce,
                },
              },
            },
          };
          break;
        case "aws":
          insertEncrypt = {
            aws: {
              secretsmanager: {
                endpoint: awsEndpoint,
                region: awsRegion,
                kmskey: awsKMSKey,
                credentials: {
                  accesskey: awsAccessKey,
                  secretkey: awsSecretKey,
                  token: awsToken,
                },
              },
            },
          };
          break;
        case "azure":
          insertEncrypt = {
            azure: {
              keyvault: {
                endpoint: azureEndpoint,
                credentials: {
                  tenant_id: azureTenantID,
                  client_id: azureClientID,
                  client_secret: azureClientSecret,
                },
              },
            },
          };
          break;
        case "gcp":
          insertEncrypt = {
            gcp: {
              secretmanager: {
                project_id: gcpProjectID,
                endpoint: gcpEndpoint,
                credentials: {
                  client_email: gcpClientEmail,
                  client_id: gcpClientID,
                  private_key_id: gcpPrivateKeyID,
                  private_key: gcpPrivateKey,
                },
              },
            },
          };
          break;
        case "vault":
          let vaultKeyPair = null;
          let vaultCAInsert = null;
          if (
            vaultCertificate.encoded_key !== "" &&
            vaultCertificate.encoded_cert !== ""
          ) {
            vaultKeyPair = {
              key: vaultCertificate.encoded_key,
              crt: vaultCertificate.encoded_cert,
            };
          }
          if (vaultCA.encoded_cert !== "") {
            vaultCAInsert = {
              ca: vaultCA.encoded_cert,
            };
          }
          let vaultTLS = null;
          if (vaultKeyPair || vaultCAInsert) {
            vaultTLS = {
              tls: {
                ...vaultKeyPair,
                ...vaultCAInsert,
              },
            };
          }
          insertEncrypt = {
            vault: {
              endpoint: vaultEndpoint,
              engine: vaultEngine,
              namespace: vaultNamespace,
              prefix: vaultPrefix,
              approle: {
                engine: vaultAppRoleEngine,
                id: vaultId,
                secret: vaultSecret,
                retry: parseInt(vaultRetry),
              },
              ...vaultTLS,
              status: {
                ping: parseInt(vaultPing),
              },
            },
          };
          break;
      }

      let encryptionServerKeyPair: any = {};
      let encryptionClientKeyPair: any = {};

      if (
        clientCertificate.encoded_key !== "" &&
        clientCertificate.encoded_cert !== ""
      ) {
        encryptionClientKeyPair = {
          client: {
            key: clientCertificate.encoded_key,
            crt: clientCertificate.encoded_cert,
          },
        };
      }

      if (
        serverCertificate.encoded_key !== "" &&
        serverCertificate.encoded_cert !== ""
      ) {
        encryptionServerKeyPair = {
          server: {
            key: serverCertificate.encoded_key,
            crt: serverCertificate.encoded_cert,
          },
        };
      }

      dataSend = {
        ...dataSend,
        encryption: {
          replicas: kesReplicas,
          securityContext: kesSecurityContext,
          image: kesImage,
          ...encryptionClientKeyPair,
          ...encryptionServerKeyPair,
          ...insertEncrypt,
        },
      };
    }

    let dataIDP: any = {};
    switch (idpSelection) {
      case "Built-in":
        let keyarray = [];
        for (let i = 0; i < accessKeys.length; i++) {
          keyarray.push({
            access_key: accessKeys[i],
            secret_key: secretKeys[i],
          });
        }
        dataIDP = {
          keys: keyarray,
        };
        break;
      case "OpenID":
        dataIDP = {
          oidc: {
            configuration_url: openIDConfigurationURL,
            client_id: openIDClientID,
            secret_id: openIDSecretID,
            claim_name: openIDClaimName,
            callback_url: openIDCallbackURL,
            scopes: openIDScopes,
          },
        };
        break;
      case "AD":
        dataIDP = {
          active_directory: {
            url: ADURL,
            skip_tls_verification: ADSkipTLS,
            server_insecure: ADServerInsecure,
            group_search_base_dn: ADGroupSearchBaseDN,
            group_search_filter: ADGroupSearchFilter,
            user_dns: ADUserDNs,
            lookup_bind_dn: ADLookupBindDN,
            lookup_bind_password: ADLookupBindPassword,
            user_dn_search_base_dn: ADUserDNSearchBaseDN,
            user_dn_search_filter: ADUserDNSearchFilter,
            server_start_tls: ADServerStartTLS,
          },
        };
        break;
    }

    let domains: any = {};
    let sendDomain: any = {};

    if (setDomains) {
      if (consoleDomain !== "") {
        domains.console = consoleDomain;
      }

      const filteredDomains = minioDomains.filter((dom) => dom.trim() !== "");

      if (filteredDomains.length > 0) {
        domains.minio = filteredDomains;
      }

      if (Object.keys(domains).length > 0) {
        sendDomain.domains = domains;
      }
    }

    dataSend = {
      ...dataSend,
      ...sendDomain,
      idp: { ...dataIDP },
    };

    const response = createTenantCall(dataSend)
      .then((resp) => {
        return resp;
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(err));
        return rejectWithValue(err);
      });
    return response;
  }
);
