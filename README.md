<div align="right">
    <img src="https://raw.githubusercontent.com/GuinsooLab/console/main/assets/guinsoolab-badge.png" width="60" alt="badge">
    <br />
</div>
<div align="center">
   <img src="https://raw.githubusercontent.com/GuinsooLab/console/main/assets/guinsoolab-console.svg" width="80" alt="console"/>
   <br/>
   <small>Management UI for GuinsooLab</small>
</div>


# GuinsooLab Console

A graphical user interface for [GuinsooLab](https://guinsoolab.github.io/glab/).

![Overview](https://raw.githubusercontent.com/GuinsooLab/console/main/assets/sso-login.png)

## Install

### Docker

Pull the latest release via:
```
docker pull guinsoolab/console (coming)
```

### Build from source
> You will need a working Go environment. Therefore, please follow [How to install Go](https://golang.org/doc/install).
> Minimum version required is go1.17

```
git clone git@github.com:GuinsooLab/console.git
sh cross-compile.sh
./console server
cd portal-ui
yarn start
```

## Setup

All `console` needs is a `GuinsooLab` user with admin privileges and URL pointing to your GuinsooLab deployment.

> Note: We don't recommend using GuinsooLab's Operator Credentials

### 1. Create a user `console` using `mc`

```bash
mc admin user add mystore/
Enter Access Key: admin
Enter Secret Key: xxxxxxxx
```

### 2. Create a policy for `console` with admin access to all resources (for testing)

```sh
cat > admin.json << EOF
{
	"Version": "2012-10-17",
	"Statement": [{
			"Action": [
				"admin:*"
			],
			"Effect": "Allow",
			"Sid": ""
		},
		{
			"Action": [
                "s3:*"
			],
			"Effect": "Allow",
			"Resource": [
				"arn:aws:s3:::*"
			],
			"Sid": ""
		}
	]
}
EOF
```

```sh
mc admin policy add mystore/ consoleAdmin admin.json
```

### 3. Set the policy for the new `console` user

```sh
mc admin policy set myGuinsooLab ConsoleAdmin user=console
```

> NOTE: Additionally, you can create policies to limit the privileges for other `console` users, for example, if you want the user to only have access to dashboard, buckets, notifications and watch page, the policy should look like this:

```json
{
	"Version": "2012-10-17",
	"Statement": [{
			"Action": [
				"admin:ServerInfo"
			],
			"Effect": "Allow",
			"Sid": ""
		},
		{
			"Action": [
				"s3:ListenBucketNotification",
				"s3:PutBucketNotification",
				"s3:GetBucketNotification",
				"s3:ListMultipartUploadParts",
				"s3:ListBucketMultipartUploads",
				"s3:ListBucket",
				"s3:HeadBucket",
				"s3:GetObject",
				"s3:GetBucketLocation",
				"s3:AbortMultipartUpload",
				"s3:CreateBucket",
				"s3:PutObject",
				"s3:DeleteObject",
				"s3:DeleteBucket",
				"s3:PutBucketPolicy",
				"s3:DeleteBucketPolicy",
				"s3:GetBucketPolicy"
			],
			"Effect": "Allow",
			"Resource": [
				"arn:aws:s3:::*"
			],
			"Sid": ""
		}
	]
}
```

## Documentation

- Productions
  - [Data Discovery](https://ciusji.gitbook.io/guinsoolab/products/data-discovery)
  - [Query Engine](https://ciusji.gitbook.io/guinsoolab/products/query-engine)
  - [Data Storage](https://ciusji.gitbook.io/guinsoolab/products/data-storage)
  - [Process Engine](https://ciusji.gitbook.io/guinsoolab/products/process-engine)
  - [Data Flow](https://ciusji.gitbook.io/guinsoolab/products/data-flow)
  - [Data Observability](https://ciusji.gitbook.io/guinsoolab/products/data-observability)
- BI-Tools
  - [Spotrix](https://ciusji.gitbook.io/guinsoolab/bi-tools/spotrix)
  - [IreliaTable](https://ciusji.gitbook.io/guinsoolab/bi-tools/ireliatable)
  - [ElixirNote](https://ciusji.gitbook.io/guinsoolab/bi-tools/elixirnote)
  - [JhinBoard](https://ciusji.gitbook.io/guinsoolab/bi-tools/jhinboard)
- Solutions
  - [GuinsooLab Console](https://ciusji.gitbook.io/guinsoolab/solutions/guinsoolab-console)
  - [GuinsooLab Finance](https://ciusji.gitbook.io/guinsoolab/solutions/guinsoolab-finance)
  - [GuinsooLab Infrastructure](https://ciusji.gitbook.io/guinsoolab/solutions/guinsoolab-infrastructure)
  - [GuinsooLab Next-Gen BI](https://ciusji.gitbook.io/guinsoolab/solutions/guinsoolab-nextgen-bi)

## Start Console service

Before running console service, following environment settings must be supplied
```sh
# Salt to encrypt JWT payload
export CONSOLE_PBKDF_PASSPHRASE=SECRET

# Required to encrypt JWT payload
export CONSOLE_PBKDF_SALT=SECRET

# AnnaStore Endpoint
export CONSOLE_ANNASTORE_SERVER=http://localhost:9000
```

Now start the console service.
```
./console server
2021-01-19 02:36:08.893735 I | 2021/01/19 02:36:08 server.go:129: Serving console at http://localhost:9090
```

By default `console` runs on port `9090` this can be changed with `--port` of your choice.

## Start Console service with TLS

Copy your `public.crt` and `private.key` to `~/.console/certs`, then:

```sh
./console server
2021-01-19 02:36:08.893735 I | 2021/01/19 02:36:08 server.go:129: Serving console at http://[::]:9090
2021-01-19 02:36:08.893735 I | 2021/01/19 02:36:08 server.go:129: Serving console at https://[::]:9443
```

For advanced users, `console` has support for multiple certificates to service clients through multiple domains.

Following tree structure is expected for supporting multiple domains:
```sh
 certs/
  │
  ├─ public.crt
  ├─ private.key
  │
  ├─ example.com/
  │   │
  │   ├─ public.crt
  │   └─ private.key
  └─ foobar.org/
     │
     ├─ public.crt
     └─ private.key
  ...

```

## Contribute to console Project
Please follow console [Contributor's Guide](https://ciusji.gitbook.io/guinsoolab/appendix/contribution)


