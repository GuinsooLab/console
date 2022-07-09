"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[4394],{23804:function(e,t,o){o(72791);var n=o(11135),r=o(25787),i=o(61889),a=o(80184);t.Z=(0,r.Z)((function(e){return(0,n.Z)({root:{border:"1px solid #E2E2E2",borderRadius:2,backgroundColor:"#FBFAFA",paddingLeft:25,paddingTop:31,paddingBottom:21,paddingRight:30},leftItems:{fontSize:16,fontWeight:"bold",marginBottom:15,display:"flex",alignItems:"center","& .min-icon":{marginRight:15,height:28,width:38}},helpText:{fontSize:16,paddingLeft:5}})}))((function(e){var t=e.classes,o=e.iconComponent,n=e.title,r=e.help;return(0,a.jsx)("div",{className:t.root,children:(0,a.jsxs)(i.ZP,{container:!0,children:[(0,a.jsxs)(i.ZP,{item:!0,xs:12,className:t.leftItems,children:[o,n]}),(0,a.jsx)(i.ZP,{item:!0,xs:12,className:t.helpText,children:r})]})})}))},81806:function(e,t,o){var n=o(1413),r=o(45987),i=(o(72791),o(11135)),a=o(25787),l=o(80184),s=["classes","children"];t.Z=(0,a.Z)((function(e){return(0,i.Z)({root:{padding:0,margin:0,border:0,backgroundColor:"transparent",textDecoration:"underline",cursor:"pointer",fontSize:"inherit",color:e.palette.info.main,fontFamily:"Lato, sans-serif"}})}))((function(e){var t=e.classes,o=e.children,i=(0,r.Z)(e,s);return(0,l.jsx)("button",(0,n.Z)((0,n.Z)({},i),{},{className:t.root,children:o}))}))},59114:function(e,t,o){var n=o(4942),r=o(1413),i=(o(72791),o(63466)),a=o(74900),l=o(27391),s=o(25787),c=o(11135),d=o(23814),p=o(80184);t.Z=(0,s.Z)((function(e){return(0,c.Z)({searchField:(0,r.Z)({},d.qg.searchField),adornment:{}})}))((function(e){var t=e.placeholder,o=void 0===t?"":t,r=e.classes,s=e.onChange,c=e.adornmentPosition,d=void 0===c?"end":c,u=e.overrideClass,m=e.value,h=(0,n.Z)({disableUnderline:!0},"".concat(d,"Adornment"),(0,p.jsx)(i.Z,{position:d,className:r.adornment,children:(0,p.jsx)(a.Z,{})}));return(0,p.jsx)(l.Z,{placeholder:o,className:u||r.searchField,id:"search-resource",label:"",InputProps:h,onChange:function(e){s(e.target.value)},variant:"standard",value:m})}))},4394:function(e,t,o){o.r(t);var n=o(29439),r=o(1413),i=o(72791),a=o(16871),l=o(11135),s=o(25787),c=o(40986),d=o(82460),p=o(61889),u=o(37267),m=o(15514),h=o(3923),f=o(92983),g=o(23814),y=o(81207),b=o(28789),S=o(23804),v=o(81806),T=o(74794),x=o(59114),k=o(40603),A=o(56087),E=o(87995),_=o(81551),Z=o(80184);t.default=(0,s.Z)((function(e){return(0,l.Z)((0,r.Z)((0,r.Z)((0,r.Z)((0,r.Z)({},g.OR),g.Je),(0,g.Bz)(e.spacing(4))),{},{twHeight:{minHeight:400},tableBlock:(0,r.Z)({},g.VX.tableBlock),rightActionItems:{display:"flex",alignItems:"center","& button":{whiteSpace:"nowrap"}},searchField:(0,r.Z)((0,r.Z)({},g.qg.searchField),{},{maxWidth:380})}))}))((function(e){var t=e.classes,o=(0,_.TL)(),r=(0,a.s0)(),l=(0,i.useState)([]),s=(0,n.Z)(l,2),g=s[0],j=s[1],N=(0,i.useState)(""),L=(0,n.Z)(N,2),C=L[0],w=L[1],q=(0,i.useState)(!1),I=(0,n.Z)(q,2),P=I[0],M=I[1];(0,i.useEffect)((function(){if(P){y.Z.invoke("GET","/api/v1/admin/notification_endpoints").then((function(e){var t=[];null!==e.notification_endpoints&&(t=e.notification_endpoints),j((0,m.fk)(t)),M(!1)})).catch((function(e){o((0,E.Ih)(e)),M(!1)}))}}),[P,o]),(0,i.useEffect)((function(){M(!0)}),[]);var Q=g.filter((function(e){return""===C||e.service_name.indexOf(C)>=0}));return(0,Z.jsx)(i.Fragment,{children:(0,Z.jsxs)(T.Z,{children:[(0,Z.jsxs)(p.ZP,{item:!0,xs:12,className:t.actionsTray,children:[(0,Z.jsx)(x.Z,{placeholder:"Search target",onChange:w,overrideClass:t.searchField,value:C}),(0,Z.jsxs)("div",{className:t.rightActionItems,children:[(0,Z.jsx)(k.Z,{tooltip:"Refresh List",text:"Refresh",variant:"outlined",color:"primary",icon:(0,Z.jsx)(b.default,{}),onClick:function(){M(!0)}}),(0,Z.jsx)(k.Z,{tooltip:"Add Notification Target",text:" Add Notification Target",variant:"contained",color:"primary",icon:(0,Z.jsx)(h.dtP,{}),onClick:function(){r(A.gA.NOTIFICATIONS_ENDPOINTS_ADD)}})]})]}),P&&(0,Z.jsx)(c.Z,{}),!P&&(0,Z.jsxs)(i.Fragment,{children:[g.length>0&&(0,Z.jsxs)(i.Fragment,{children:[(0,Z.jsx)(p.ZP,{item:!0,xs:12,className:t.tableBlock,children:(0,Z.jsx)(f.Z,{itemActions:[],columns:[{label:"Status",elementKey:"status",renderFunction:function(e){return(0,Z.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[(0,Z.jsx)(u.Z,{style:"Offline"===e?{color:d.Z[500]}:{}}),e]})},width:150},{label:"Service",elementKey:"service_name"}],isLoading:P,records:Q,entityName:"Notification Endpoints",idField:"service_name",customPaperHeight:t.twHeight})}),(0,Z.jsx)(p.ZP,{item:!0,xs:12,children:(0,Z.jsx)(S.Z,{title:"Notification Endpoints",iconComponent:(0,Z.jsx)(h.cCG,{}),help:(0,Z.jsxs)(i.Fragment,{children:["MinIO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. MinIO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.",(0,Z.jsx)("br",{}),(0,Z.jsx)("br",{}),"You can learn more at our"," ",(0,Z.jsx)("a",{href:"https://docs.min.io/minio/baremetal/monitoring/bucket-notifications/bucket-notifications.html?ref=con",target:"_blank",rel:"noreferrer",children:"documentation"}),"."]})})})]}),0===g.length&&(0,Z.jsx)(p.ZP,{container:!0,justifyContent:"center",alignContent:"center",alignItems:"center",children:(0,Z.jsx)(p.ZP,{item:!0,xs:8,children:(0,Z.jsx)(S.Z,{title:"Notification Targets",iconComponent:(0,Z.jsx)(h.cCG,{}),help:(0,Z.jsxs)(i.Fragment,{children:["MinIO bucket notifications allow administrators to send notifications to supported external services on certain object or bucket events. MinIO supports bucket and object-level S3 events similar to the Amazon S3 Event Notifications.",(0,Z.jsx)("br",{}),(0,Z.jsx)("br",{}),"To get started,"," ",(0,Z.jsx)(v.Z,{onClick:function(){r(A.gA.NOTIFICATIONS_ENDPOINTS_ADD)},children:"Add a Notification Target"}),"."]})})})})]})]})})}))},15514:function(e,t,o){o.d(t,{BR:function(){return g},DD:function(){return b},dM:function(){return a},ee:function(){return i},fk:function(){return f},oj:function(){return S}});var n,r=o(4942),i="notify_postgres",a="notify_mysql",l="notify_kafka",s="notify_amqp",c="notify_mqtt",d="notify_redis",p="notify_nats",u="notify_elasticsearch",m="notify_webhook",h="notify_nsq",f=function(e){return e.map((function(e){return{service_name:"".concat(e.service,":").concat(e.account_id),status:e.status}}))},g=[{actionTrigger:i,targetTitle:"PostgreSQL",logo:"/postgres-logo.svg"},{actionTrigger:l,targetTitle:"Kafka",logo:"/kafka-logo.svg"},{actionTrigger:s,targetTitle:"AMQP",logo:"/amqp-logo.svg"},{actionTrigger:c,targetTitle:"MQTT",logo:"/mqtt-logo.svg"},{actionTrigger:d,targetTitle:"Redis",logo:"/redis-logo.svg"},{actionTrigger:p,targetTitle:"NATS",logo:"/nats-logo.svg"},{actionTrigger:a,targetTitle:"Mysql",logo:"/mysql-logo.svg"},{actionTrigger:u,targetTitle:"Elastic Search",logo:"/elasticsearch-logo.svg"},{actionTrigger:m,targetTitle:"Webhook",logo:"/webhooks-logo.svg"},{actionTrigger:h,targetTitle:"NSQ",logo:"/nsq-logo.svg"}],y=[{name:"queue-dir",label:"Queue Directory",required:!0,tooltip:"staging dir for undelivered messages e.g. '/home/events'",type:"string",placeholder:"Enter Queue Directory"},{name:"queue-limit",label:"Queue Limit",required:!1,tooltip:"maximum limit for undelivered messages, defaults to '10000'",type:"number",placeholder:"Enter Queue Limit"},{name:"comment",label:"Comment",required:!1,type:"comment",placeholder:"Enter custom notes if any"}],b=function(e){return e.filter((function(e){return""!==e.value}))},S=(n={},(0,r.Z)(n,l,[{name:"brokers",label:"Brokers",required:!0,tooltip:"Comma separated list of Kafka broker addresses",type:"string",placeholder:"Enter Brokers"},{name:"topic",label:"Topic",tooltip:"Kafka topic used for bucket notifications",type:"string",placeholder:"Enter Topic"},{name:"sasl_username",label:"SASL Username",tooltip:"Username for SASL/PLAIN or SASL/SCRAM authentication",type:"string",placeholder:"Enter SASL Username"},{name:"sasl_password",label:"SASL Password",tooltip:"Password for SASL/PLAIN or SASL/SCRAM authentication",type:"string",placeholder:"Enter SASL Password"},{name:"sasl_mechanism",label:"SASL Mechanism",tooltip:"SASL authentication mechanism, default 'PLAIN'",type:"string"},{name:"tls_client_auth",label:"TLS Client Auth",tooltip:"Client Auth determines the Kafka server's policy for TLS client auth",type:"string",placeholder:"Enter TLS Client Auth"},{name:"sasl",label:"SASL",tooltip:"Set to 'on' to enable SASL authentication",type:"on|off"},{name:"tls",label:"TLS",tooltip:"Set to 'on' to enable TLS",type:"on|off"},{name:"tls_skip_verify",label:"TLS skip verify",tooltip:'Trust server TLS without verification, defaults to "on" (verify)',type:"on|off"},{name:"client_tls_cert",label:"client TLS cert",tooltip:"Path to client certificate for mTLS auth",type:"path",placeholder:"Enter TLS Client Cert"},{name:"client_tls_key",label:"client TLS key",tooltip:"Path to client key for mTLS auth",type:"path",placeholder:"Enter TLS Client Key"},{name:"version",label:"Version",tooltip:"Specify the version of the Kafka cluster e.g '2.2.0'",type:"string",placeholder:"Enter Kafka Version"}].concat(y)),(0,r.Z)(n,s,[{name:"url",required:!0,label:"URL",tooltip:"AMQP server endpoint e.g. `amqp://myuser:mypassword@localhost:5672`",type:"url"},{name:"exchange",label:"Exchange",tooltip:"Name of the AMQP exchange",type:"string",placeholder:"Enter Exchange"},{name:"exchange_type",label:"Exchange Type",tooltip:"AMQP exchange type",type:"string",placeholder:"Enter Exchange Type"},{name:"routing_key",label:"Routing Key",tooltip:"Routing key for publishing",type:"string",placeholder:"Enter Routing Key"},{name:"mandatory",label:"Mandatory",tooltip:"Quietly ignore undelivered messages when set to 'off', default is 'on'",type:"on|off"},{name:"durable",label:"Durable",tooltip:"Persist queue across broker restarts when set to 'on', default is 'off'",type:"on|off"},{name:"no_wait",label:"No Wait",tooltip:"Non-blocking message delivery when set to 'on', default is 'off'",type:"on|off"},{name:"internal",label:"Internal",tooltip:"Set to 'on' for exchange to be not used directly by publishers, but only when bound to other exchanges",type:"on|off"},{name:"auto_deleted",label:"Auto Deleted",tooltip:"Auto delete queue when set to 'on', when there are no consumers",type:"on|off"},{name:"delivery_mode",label:"Delivery Mode",tooltip:"Set to '1' for non-persistent or '2' for persistent queue",type:"number",placeholder:"Enter Delivery Mode"}].concat(y)),(0,r.Z)(n,d,[{name:"address",required:!0,label:"Address",tooltip:"Redis server's address. For example: `localhost:6379`",type:"address",placeholder:"Enter Address"},{name:"key",required:!0,label:"Key",tooltip:"Redis key to store/update events, key is auto-created",type:"string",placeholder:"Enter Key"},{name:"password",label:"Password",tooltip:"Redis server password",type:"string",placeholder:"Enter Password"}].concat(y)),(0,r.Z)(n,c,[{name:"broker",required:!0,label:"Broker",tooltip:"MQTT server endpoint e.g. `tcp://localhost:1883`",type:"uri",placeholder:"Enter Brokers"},{name:"topic",required:!0,label:"Topic",tooltip:"name of the MQTT topic to publish",type:"string",placeholder:"Enter Topic"},{name:"username",label:"Username",tooltip:"MQTT username",type:"string",placeholder:"Enter Username"},{name:"password",label:"Password",tooltip:"MQTT password",type:"string",placeholder:"Enter Password"},{name:"qos",label:"QOS",tooltip:"Set the quality of service priority, defaults to '0'",type:"number",placeholder:"Enter QOS"},{name:"keep_alive_interval",label:"Keep Alive Interval",tooltip:"Keep-alive interval for MQTT connections in s,m,h,d",type:"duration",placeholder:"Enter Keep Alive Internal"},{name:"reconnect_interval",label:"Reconnect Interval",tooltip:"Reconnect interval for MQTT connections in s,m,h,d",type:"duration",placeholder:"Enter Reconnect Interval"}].concat(y)),(0,r.Z)(n,p,[{name:"address",required:!0,label:"Address",tooltip:"NATS server address e.g. '0.0.0.0:4222'",type:"address",placeholder:"Enter Address"},{name:"subject",required:!0,label:"Subject",tooltip:"NATS subscription subject",type:"string",placeholder:"Enter NATS Subject"},{name:"username",label:"Username",tooltip:"NATS username",type:"string",placeholder:"Enter NATS Username"},{name:"password",label:"Password",tooltip:"NATS password",type:"string",placeholder:"Enter NATS password"},{name:"token",label:"Token",tooltip:"NATS token",type:"string",placeholder:"Enter NATS token"},{name:"tls",label:"TLS",tooltip:"Set to 'on' to enable TLS",type:"on|off"},{name:"tls_skip_verify",label:"TLS Skip Verify",tooltip:'Trust server TLS without verification, defaults to "on" (verify)',type:"on|off"},{name:"ping_interval",label:"Ping Interval",tooltip:"Client ping commands interval in s,m,h,d. Disabled by default",type:"duration",placeholder:"Enter Ping Interval"},{name:"streaming",label:"Streaming",tooltip:"Set to 'on', to use streaming NATS server",type:"on|off"},{name:"streaming_async",label:"Streaming async",tooltip:"Set to 'on', to enable asynchronous publish",type:"on|off"},{name:"streaming_max_pub_acks_in_flight",label:"Streaming max publish ACKS in flight",tooltip:"Number of messages to publish without waiting for ACKs",type:"number",placeholder:"Enter Streaming in flight value"},{name:"streaming_cluster_id",label:"Streaming Cluster ID",tooltip:"Unique ID for NATS streaming cluster",type:"string",placeholder:"Enter Streaming Cluster ID"},{name:"cert_authority",label:"Cert Authority",tooltip:"Path to certificate chain of the target NATS server",type:"string",placeholder:"Enter Cert Authority"},{name:"client_cert",label:"Client Cert",tooltip:"Client cert for NATS mTLS auth",type:"string",placeholder:"Enter Client Cert"},{name:"client_key",label:"Client Key",tooltip:"Client cert key for NATS mTLS auth",type:"string",placeholder:"Enter Client Key"}].concat(y)),(0,r.Z)(n,u,[{name:"url",required:!0,label:"URL",tooltip:"Elasticsearch server's address, with optional authentication info",type:"url",placeholder:"Enter URL"},{name:"index",required:!0,label:"Index",tooltip:"Elasticsearch index to store/update events, index is auto-created",type:"string",placeholder:"Enter Index"},{name:"format",required:!0,label:"Format",tooltip:"'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'",type:"enum",placeholder:"Enter Format"}].concat(y)),(0,r.Z)(n,m,[{name:"endpoint",required:!0,label:"Endpoint",tooltip:"webhook server endpoint e.g. http://localhost:8080/minio/events",type:"url",placeholder:"Enter Endpoint"},{name:"auth_token",label:"Auth Token",tooltip:"opaque string or JWT authorization token",type:"string",placeholder:"Enter auth_token"}].concat(y)),(0,r.Z)(n,h,[{name:"nsqd_address",required:!0,label:"NSQD Address",tooltip:"NSQ server address e.g. '127.0.0.1:4150'",type:"address",placeholder:"Enter nsqd_address"},{name:"topic",required:!0,label:"Topic",tooltip:"NSQ topic",type:"string",placeholder:"Enter Topic"},{name:"tls",label:"TLS",tooltip:"set to 'on' to enable TLS",type:"on|off"},{name:"tls_skip_verify",label:"TLS Skip Verify",tooltip:'trust server TLS without verification, defaults to "on" (verify)',type:"on|off"}].concat(y)),n)}}]);
//# sourceMappingURL=4394.d1cae66d.chunk.js.map