// This file is part of GuinsooLab Console Server
// Copyright (c) 2020-2022 GuinsooLab, Inc.
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

import {
  AzureTierIcon,
  AzureTierIconXs,
  GoogleTierIcon,
  GoogleTierIconXs,
  MinIOTierIcon,
  MinIOTierIconXs,
  S3TierIcon,
  S3TierIconXs,
} from "../../../../icons";

export const minioServiceName = "minio";
export const gcsServiceName = "gcs";
export const s3ServiceName = "s3";
export const azureServiceName = "azure";

export const tierTypes = [
  {
    serviceName: minioServiceName,
    targetTitle: "MinIO",
    logo: <MinIOTierIcon />,
    logoXs: <MinIOTierIconXs />,
  },
  {
    serviceName: gcsServiceName,
    targetTitle: "Google Cloud Storage",
    logo: <GoogleTierIcon />,
    logoXs: <GoogleTierIconXs />,
  },
  {
    serviceName: s3ServiceName,
    targetTitle: "AWS S3",
    logo: <S3TierIcon />,
    logoXs: <S3TierIconXs />,
  },
  {
    serviceName: azureServiceName,
    targetTitle: "Azure",
    logo: <AzureTierIcon />,
    logoXs: <AzureTierIconXs />,
  },
];
