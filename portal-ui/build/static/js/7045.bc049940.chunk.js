"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[7045],{51654:function(e,t,o){o(72791);var r=o(64554),n=o(80184);t.Z=function(e){var t=e.children;return(0,n.jsx)(r.Z,{sx:{border:"1px solid #eaeaea",padding:{lg:"40px",xs:"15px"}},children:t})}},37045:function(e,t,o){o.r(t);var r=o(1413),n=o(72791),a=o(16871),l=o(11135),i=o(25787),s=o(15514),c=o(23814),p=o(32291),d=o(84669),u=o(74794),m=o(56087),g=o(51654),h=o(80184),f=s.BR.filter((function(e){return""!==e.logo}));t.default=(0,i.Z)((function(e){return(0,l.Z)((0,r.Z)((0,r.Z)({},c.Je),c.fc))}))((function(e){var t=e.classes,o=(0,a.s0)();return(0,h.jsxs)(n.Fragment,{children:[(0,h.jsx)(p.Z,{label:(0,h.jsx)(n.Fragment,{children:(0,h.jsx)(d.Z,{to:m.gA.NOTIFICATIONS_ENDPOINTS,label:"Notification Targets"})}),actions:(0,h.jsx)(n.Fragment,{})}),(0,h.jsx)(u.Z,{children:(0,h.jsxs)(g.Z,{children:[(0,h.jsx)("div",{style:{fontSize:16,fontWeight:600,paddingBottom:15},children:"Select Target Type"}),(0,h.jsx)("div",{className:t.iconContainer,children:f.map((function(e){return(0,h.jsxs)("button",{className:t.lambdaNotif,onClick:function(){o("".concat(m.gA.NOTIFICATIONS_ENDPOINTS_ADD,"/").concat(e.actionTrigger))},children:[(0,h.jsx)("div",{className:t.lambdaNotifIcon,children:(0,h.jsx)("img",{src:e.logo,className:t.logoButton,alt:e.targetTitle})}),(0,h.jsx)("div",{className:t.lambdaNotifTitle,children:(0,h.jsx)("b",{children:e.targetTitle})})]},"icon-".concat(e.targetTitle))}))})]})})]})}))},15514:function(e,t,o){o.d(t,{BR:function(){return f},DD:function(){return b},dM:function(){return l},ee:function(){return a},fk:function(){return h},oj:function(){return T}});var r,n=o(4942),a="notify_postgres",l="notify_mysql",i="notify_kafka",s="notify_amqp",c="notify_mqtt",p="notify_redis",d="notify_nats",u="notify_elasticsearch",m="notify_webhook",g="notify_nsq",h=function(e){return e.map((function(e){return{service_name:"".concat(e.service,":").concat(e.account_id),status:e.status}}))},f=[{actionTrigger:a,targetTitle:"PostgreSQL",logo:"/postgres-logo.svg"},{actionTrigger:i,targetTitle:"Kafka",logo:"/kafka-logo.svg"},{actionTrigger:s,targetTitle:"AMQP",logo:"/amqp-logo.svg"},{actionTrigger:c,targetTitle:"MQTT",logo:"/mqtt-logo.svg"},{actionTrigger:p,targetTitle:"Redis",logo:"/redis-logo.svg"},{actionTrigger:d,targetTitle:"NATS",logo:"/nats-logo.svg"},{actionTrigger:l,targetTitle:"Mysql",logo:"/mysql-logo.svg"},{actionTrigger:u,targetTitle:"Elastic Search",logo:"/elasticsearch-logo.svg"},{actionTrigger:m,targetTitle:"Webhook",logo:"/webhooks-logo.svg"},{actionTrigger:g,targetTitle:"NSQ",logo:"/nsq-logo.svg"}],y=[{name:"queue-dir",label:"Queue Directory",required:!0,tooltip:"staging dir for undelivered messages e.g. '/home/events'",type:"string",placeholder:"Enter Queue Directory"},{name:"queue-limit",label:"Queue Limit",required:!1,tooltip:"maximum limit for undelivered messages, defaults to '10000'",type:"number",placeholder:"Enter Queue Limit"},{name:"comment",label:"Comment",required:!1,type:"comment",placeholder:"Enter custom notes if any"}],b=function(e){return e.filter((function(e){return""!==e.value}))},T=(r={},(0,n.Z)(r,i,[{name:"brokers",label:"Brokers",required:!0,tooltip:"Comma separated list of Kafka broker addresses",type:"string",placeholder:"Enter Brokers"},{name:"topic",label:"Topic",tooltip:"Kafka topic used for bucket notifications",type:"string",placeholder:"Enter Topic"},{name:"sasl_username",label:"SASL Username",tooltip:"Username for SASL/PLAIN or SASL/SCRAM authentication",type:"string",placeholder:"Enter SASL Username"},{name:"sasl_password",label:"SASL Password",tooltip:"Password for SASL/PLAIN or SASL/SCRAM authentication",type:"string",placeholder:"Enter SASL Password"},{name:"sasl_mechanism",label:"SASL Mechanism",tooltip:"SASL authentication mechanism, default 'PLAIN'",type:"string"},{name:"tls_client_auth",label:"TLS Client Auth",tooltip:"Client Auth determines the Kafka server's policy for TLS client auth",type:"string",placeholder:"Enter TLS Client Auth"},{name:"sasl",label:"SASL",tooltip:"Set to 'on' to enable SASL authentication",type:"on|off"},{name:"tls",label:"TLS",tooltip:"Set to 'on' to enable TLS",type:"on|off"},{name:"tls_skip_verify",label:"TLS skip verify",tooltip:'Trust server TLS without verification, defaults to "on" (verify)',type:"on|off"},{name:"client_tls_cert",label:"client TLS cert",tooltip:"Path to client certificate for mTLS auth",type:"path",placeholder:"Enter TLS Client Cert"},{name:"client_tls_key",label:"client TLS key",tooltip:"Path to client key for mTLS auth",type:"path",placeholder:"Enter TLS Client Key"},{name:"version",label:"Version",tooltip:"Specify the version of the Kafka cluster e.g '2.2.0'",type:"string",placeholder:"Enter Kafka Version"}].concat(y)),(0,n.Z)(r,s,[{name:"url",required:!0,label:"URL",tooltip:"AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`",type:"url"},{name:"exchange",label:"Exchange",tooltip:"Name of the AMQP exchange",type:"string",placeholder:"Enter Exchange"},{name:"exchange_type",label:"Exchange Type",tooltip:"AMQP exchange type",type:"string",placeholder:"Enter Exchange Type"},{name:"routing_key",label:"Routing Key",tooltip:"Routing key for publishing",type:"string",placeholder:"Enter Routing Key"},{name:"mandatory",label:"Mandatory",tooltip:"Quietly ignore undelivered messages when set to 'off', default is 'on'",type:"on|off"},{name:"durable",label:"Durable",tooltip:"Persist queue across broker restarts when set to 'on', default is 'off'",type:"on|off"},{name:"no_wait",label:"No Wait",tooltip:"Non-blocking message delivery when set to 'on', default is 'off'",type:"on|off"},{name:"internal",label:"Internal",tooltip:"Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges",type:"on|off"},{name:"auto_deleted",label:"Auto Deleted",tooltip:"Auto delete queue when set to 'on', when there are no consumers",type:"on|off"},{name:"delivery_mode",label:"Delivery Mode",tooltip:"Set to '1' for non-persistent or '2' for persistent queue",type:"number",placeholder:"Enter Delivery Mode"}].concat(y)),(0,n.Z)(r,p,[{name:"address",required:!0,label:"Address",tooltip:"Redis server's address. For example: `localhost:6379`",type:"address",placeholder:"Enter Address"},{name:"key",required:!0,label:"Key",tooltip:"Redis key to store/update events, key is auto-created",type:"string",placeholder:"Enter Key"},{name:"password",label:"Password",tooltip:"Redis server password",type:"string",placeholder:"Enter Password"}].concat(y)),(0,n.Z)(r,c,[{name:"broker",required:!0,label:"Broker",tooltip:"MQTT server endpoint e.g. `tcp://localhost:1883`",type:"uri",placeholder:"Enter Brokers"},{name:"topic",required:!0,label:"Topic",tooltip:"name of the MQTT topic to publish",type:"string",placeholder:"Enter Topic"},{name:"username",label:"Username",tooltip:"MQTT username",type:"string",placeholder:"Enter Username"},{name:"password",label:"Password",tooltip:"MQTT password",type:"string",placeholder:"Enter Password"},{name:"qos",label:"QOS",tooltip:"Set the quality of service priority, defaults to '0'",type:"number",placeholder:"Enter QOS"},{name:"keep_alive_interval",label:"Keep Alive Interval",tooltip:"Keep-alive interval for MQTT connections in s,m,h,d",type:"duration",placeholder:"Enter Keep Alive Internal"},{name:"reconnect_interval",label:"Reconnect Interval",tooltip:"Reconnect interval for MQTT connections in s,m,h,d",type:"duration",placeholder:"Enter Reconnect Interval"}].concat(y)),(0,n.Z)(r,d,[{name:"address",required:!0,label:"Address",tooltip:"NATS server address e.g. '0.0.0.0:4222'",type:"address",placeholder:"Enter Address"},{name:"subject",required:!0,label:"Subject",tooltip:"NATS subscription subject",type:"string",placeholder:"Enter NATS Subject"},{name:"username",label:"Username",tooltip:"NATS username",type:"string",placeholder:"Enter NATS Username"},{name:"password",label:"Password",tooltip:"NATS password",type:"string",placeholder:"Enter NATS password"},{name:"token",label:"Token",tooltip:"NATS token",type:"string",placeholder:"Enter NATS token"},{name:"tls",label:"TLS",tooltip:"Set to 'on' to enable TLS",type:"on|off"},{name:"tls_skip_verify",label:"TLS Skip Verify",tooltip:'Trust server TLS without verification, defaults to "on" (verify)',type:"on|off"},{name:"ping_interval",label:"Ping Interval",tooltip:"Client ping commands interval in s,m,h,d. Disabled by default",type:"duration",placeholder:"Enter Ping Interval"},{name:"streaming",label:"Streaming",tooltip:"Set to 'on', to use streaming NATS server",type:"on|off"},{name:"streaming_async",label:"Streaming async",tooltip:"Set to 'on', to enable asynchronous publish",type:"on|off"},{name:"streaming_max_pub_acks_in_flight",label:"Streaming max publish ACKS in flight",tooltip:"Number of messages to publish without waiting for ACKs",type:"number",placeholder:"Enter Streaming in flight value"},{name:"streaming_cluster_id",label:"Streaming Cluster ID",tooltip:"Unique ID for NATS streaming cluster",type:"string",placeholder:"Enter Streaming Cluster ID"},{name:"cert_authority",label:"Cert Authority",tooltip:"Path to certificate chain of the target NATS server",type:"string",placeholder:"Enter Cert Authority"},{name:"client_cert",label:"Client Cert",tooltip:"Client cert for NATS mTLS auth",type:"string",placeholder:"Enter Client Cert"},{name:"client_key",label:"Client Key",tooltip:"Client cert key for NATS mTLS auth",type:"string",placeholder:"Enter Client Key"}].concat(y)),(0,n.Z)(r,u,[{name:"url",required:!0,label:"URL",tooltip:"Elasticsearch server's address, with optional authentication info",type:"url",placeholder:"Enter URL"},{name:"index",required:!0,label:"Index",tooltip:"Elasticsearch index to store/update events, index is auto-created",type:"string",placeholder:"Enter Index"},{name:"format",required:!0,label:"Format",tooltip:"'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",type:"enum",placeholder:"Enter Format"}].concat(y)),(0,n.Z)(r,m,[{name:"endpoint",required:!0,label:"Endpoint",tooltip:"webhook server endpoint e.g. http://localhost:8080/minio/events",type:"url",placeholder:"Enter Endpoint"},{name:"auth_token",label:"Auth Token",tooltip:"opaque string or JWT authorization token",type:"string",placeholder:"Enter auth_token"}].concat(y)),(0,n.Z)(r,g,[{name:"nsqd_address",required:!0,label:"NSQD Address",tooltip:"NSQ server address e.g. '127.0.0.1:4150'",type:"address",placeholder:"Enter nsqd_address"},{name:"topic",required:!0,label:"Topic",tooltip:"NSQ topic",type:"string",placeholder:"Enter Topic"},{name:"tls",label:"TLS",tooltip:"set to 'on' to enable TLS",type:"on|off"},{name:"tls_skip_verify",label:"TLS Skip Verify",tooltip:'trust server TLS without verification, defaults to "on" (verify)',type:"on|off"}].concat(y)),r)}}]);
//# sourceMappingURL=7045.bc049940.chunk.js.map