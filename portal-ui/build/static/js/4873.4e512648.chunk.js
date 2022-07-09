"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[4873],{45902:function(e,n,t){var a=t(1413),s=(t(72791),t(53767)),r=t(80184);n.Z=function(e){var n=e.label,t=void 0===n?null:n,i=e.value,o=void 0===i?"-":i,l=e.orientation,c=void 0===l?"column":l,u=e.stkProps,d=void 0===u?{}:u,x=e.lblProps,m=void 0===x?{}:x,Z=e.valProps,j=void 0===Z?{}:Z;return(0,r.jsxs)(s.Z,(0,a.Z)((0,a.Z)({direction:{xs:"column",sm:c}},d),{},{children:[(0,r.jsx)("label",(0,a.Z)((0,a.Z)({style:{marginRight:5,fontWeight:600}},m),{},{children:t})),(0,r.jsx)("label",(0,a.Z)((0,a.Z)({style:{marginRight:5,fontWeight:500}},j),{},{children:o}))]}))}},5450:function(e,n,t){var a=t(29439),s=t(72791),r=t(11135),i=t(25787),o=t(40986),l=t(79836),c=t(53382),u=t(53994),d=t(56890),x=t(35855),m=t(64554),Z=t(56125),j=t(20890),h=t(85172),p=t(95678),f=t(39281),g=t(10703),v=t(80184),b=function(e){var n=e.event,t=s.useState(!1),r=(0,a.Z)(t,2),i=r[0],o=r[1];return(0,v.jsxs)(s.Fragment,{children:[(0,v.jsxs)(x.Z,{sx:{"& > *":{borderBottom:"unset"},cursor:"pointer"},children:[(0,v.jsx)(u.Z,{component:"th",scope:"row",onClick:function(){return o(!i)},children:n.event_type}),(0,v.jsx)(u.Z,{onClick:function(){return o(!i)},children:n.reason}),(0,v.jsx)(u.Z,{onClick:function(){return o(!i)},children:n.seen}),(0,v.jsx)(u.Z,{onClick:function(){return o(!i)},children:n.message.length>=30?"".concat(n.message.slice(0,30),"..."):n.message}),(0,v.jsx)(u.Z,{onClick:function(){return o(!i)},children:i?(0,v.jsx)(p.Z,{}):(0,v.jsx)(h.Z,{})})]}),(0,v.jsx)(x.Z,{children:(0,v.jsx)(u.Z,{style:{paddingBottom:0,paddingTop:0},colSpan:5,children:(0,v.jsx)(Z.Z,{in:i,timeout:"auto",unmountOnExit:!0,children:(0,v.jsx)(m.Z,{sx:{margin:1},children:(0,v.jsx)(j.Z,{style:{background:"#efefef",border:"1px solid #dedede",padding:4,fontSize:14,color:"#666666"},children:n.message})})})})})]})};n.Z=(0,i.Z)((function(e){return(0,r.Z)({events:{"& .MuiTypography-root":{fontSize:14},"& .Mui-expanded":{"& .eventMessage":{display:"none"}}}})}))((function(e){e.classes;var n=e.events;return e.loading?(0,v.jsx)(o.Z,{}):(0,v.jsx)(f.Z,{component:g.Z,children:(0,v.jsxs)(l.Z,{"aria-label":"collapsible table",children:[(0,v.jsx)(d.Z,{children:(0,v.jsxs)(x.Z,{children:[(0,v.jsx)(u.Z,{children:"Type"}),(0,v.jsx)(u.Z,{children:"Reason"}),(0,v.jsx)(u.Z,{children:"Age"}),(0,v.jsx)(u.Z,{children:"Message"}),(0,v.jsx)(u.Z,{})]})}),(0,v.jsx)(c.Z,{children:n.map((function(e){return(0,v.jsx)(b,{event:e},"".concat(e.event_type,"-").concat(e.seen))}))})]})})}))},14873:function(e,n,t){t.r(n),t.d(n,{default:function(){return K}});var a=t(29439),s=t(1413),r=t(72791),i=t(43504),o=t(16871),l=t(11135),c=t(25787),u=t(23814),d=t(61889),x=t(18073),m=t(43896),Z=t(60364),j=t(5171),h=t(27391),p=t(10703),f=t(63466),g=t(81207),v=t(74900),b=t(81551),y=t(87995),C=t(80184),S=(0,c.Z)((function(e){return(0,l.Z)((0,s.Z)((0,s.Z)((0,s.Z)({logList:{background:"#fff",minHeight:400,height:"calc(100vh - 304px)",overflow:"auto",fontSize:13,padding:"25px 45px 0",border:"1px solid #EAEDEE",borderRadius:4}},u.Si),u.qg),{},{actionsTray:(0,s.Z)((0,s.Z)({},u.OR.actionsTray),{},{padding:"15px 0 0"}),logerror_tab:{color:"#A52A2A",paddingLeft:25},ansidefault:{color:"#000",lineHeight:"16px"},highlight:{"& span":{backgroundColor:"#082F5238"}}},(0,u.Bz)(e.spacing(4))))}))((function(e){var n=e.classes,t=e.tenant,i=e.namespace,o=e.podName,l=e.propLoading,c=(0,b.TL)(),u=(0,Z.v9)((function(e){return e.tenants.loadingTenant})),x=(0,r.useState)(""),m=(0,a.Z)(x,2),S=m[0],k=m[1],T=(0,r.useState)([]),L=(0,a.Z)(T,2),N=L[0],P=L[1],w=(0,r.useState)(!0),E=(0,a.Z)(w,2),F=E[0],I=E[1],R=new j.t1({minWidth:5,fixedHeight:!1});(0,r.useEffect)((function(){l&&I(!0)}),[l]),(0,r.useEffect)((function(){u&&I(!0)}),[u]);var A=function(e,t){if(!e)return null;var a=(e=e.replace(/([^\x20-\x7F])/g,"")).replace(/((\[[0-9;]+m))/g,""),s=""!==S&&e.toLowerCase().includes(S.toLowerCase());return a.startsWith("   ")?(0,C.jsx)("div",{className:"".concat(s?n.highlight:""),children:(0,C.jsx)("span",{className:n.tab,children:a})},t):(0,C.jsx)("div",{className:"".concat(s?n.highlight:""),children:(0,C.jsx)("span",{className:n.ansidefault,children:a})},t)};function B(e){var n=e.columnIndex,t=e.key,a=e.parent,r=e.index,i=e.style;return(0,C.jsx)(j.Z8,{cache:R,columnIndex:n,parent:a,rowIndex:r,children:(0,C.jsx)("div",{style:(0,s.Z)({},i),children:A(N[r],r)})},t)}return(0,r.useEffect)((function(){F&&g.Z.invoke("GET","/api/v1/namespaces/".concat(i,"/tenants/").concat(t,"/pods/").concat(o)).then((function(e){P(e.split("\n")),I(!1)})).catch((function(e){c((0,y.Ih)(e)),I(!1)}))}),[F,o,i,t,c]),(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(d.ZP,{item:!0,xs:12,className:n.actionsTray,children:(0,C.jsx)(h.Z,{placeholder:"Highlight Line",className:n.searchField,id:"search-resource",label:"",onChange:function(e){k(e.target.value)},InputProps:{disableUnderline:!0,startAdornment:(0,C.jsx)(f.Z,{position:"start",children:(0,C.jsx)(v.Z,{})})},variant:"standard"})}),(0,C.jsx)(d.ZP,{item:!0,xs:12,children:(0,C.jsx)("br",{})}),(0,C.jsx)(d.ZP,{item:!0,xs:12,children:(0,C.jsx)(p.Z,{children:(0,C.jsx)("div",{className:n.logList,children:N.length>=1&&(0,C.jsx)(j.qj,{children:function(e){var n=e.width,t=e.height;return(0,C.jsx)(j.aV,{rowHeight:function(e){return R.rowHeight(e)},overscanRowCount:15,rowCount:N.length,rowRenderer:B,width:n,height:t})}})})})})]})})),k=t(45248),T=t(5450),L=(0,c.Z)((function(e){return(0,l.Z)((0,s.Z)((0,s.Z)((0,s.Z)((0,s.Z)((0,s.Z)({},u.OR),u.Si),u.qg),u.bp),{},{actionsTray:(0,s.Z)((0,s.Z)({},u.OR.actionsTray),{},{padding:"15px 0 0"})}))}))((function(e){e.classes;var n=e.tenant,t=e.namespace,s=e.podName,i=e.propLoading,o=(0,b.TL)(),l=(0,Z.v9)((function(e){return e.tenants.loadingTenant})),c=(0,r.useState)([]),u=(0,a.Z)(c,2),x=u[0],m=u[1],j=(0,r.useState)(!0),h=(0,a.Z)(j,2),p=h[0],f=h[1];return(0,r.useEffect)((function(){i&&f(!0)}),[i]),(0,r.useEffect)((function(){l&&f(!0)}),[l]),(0,r.useEffect)((function(){p&&g.Z.invoke("GET","/api/v1/namespaces/".concat(t,"/tenants/").concat(n,"/pods/").concat(s,"/events")).then((function(e){for(var n=0;n<e.length;n++){var t=Date.now()/1e3|0;e[n].seen=(0,k.v1)((t-e[n].last_seen).toString())}m(e),f(!1)})).catch((function(e){o((0,y.Ih)(e)),f(!1)}))}),[p,s,t,n,o]),(0,C.jsx)(r.Fragment,{children:(0,C.jsx)(d.ZP,{item:!0,xs:12,children:(0,C.jsx)(T.Z,{events:x,loading:p})})})})),N=t(64554),P=t(81918),w=t(79836),E=t(53382),F=t(53994),I=t(56890),R=t(35855),A=t(39281),B=t(45902),D={display:"grid",gridTemplateColumns:{xs:"1fr",sm:"2fr 1fr"},gridAutoFlow:{xs:"dense",sm:"row"},gap:2,padding:"15px"},O=function(e){var n=e.title;return(0,C.jsx)(N.Z,{sx:{borderBottom:"1px solid #eaeaea",margin:0,marginBottom:"20px"},children:(0,C.jsx)("h3",{children:n})})},H=function(e){var n=e.describeInfo;return(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(O,{title:"Summary"}),(0,C.jsxs)(N.Z,{sx:(0,s.Z)({},D),children:[(0,C.jsx)(B.Z,{label:"Name",value:n.name}),(0,C.jsx)(B.Z,{label:"Namespace",value:n.namespace}),(0,C.jsx)(B.Z,{label:"Node",value:n.nodeName}),(0,C.jsx)(B.Z,{label:"Start time",value:n.startTime}),(0,C.jsx)(B.Z,{label:"Status",value:n.phase}),(0,C.jsx)(B.Z,{label:"QoS Class",value:n.qosClass}),(0,C.jsx)(B.Z,{label:"IP",value:n.podIP})]})]})},V=function(e){var n=e.annotations;return(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(O,{title:"Annotations"}),(0,C.jsx)(N.Z,{children:n.map((function(e,n){return(0,C.jsx)(P.Z,{style:{margin:"0.5%"},label:"".concat(e.key,": ").concat(e.value)},n)}))})]})},M=function(e){var n=e.labels;return(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(O,{title:"Labels"}),(0,C.jsx)(N.Z,{children:n.map((function(e,n){return(0,C.jsx)(P.Z,{style:{margin:"0.5%"},label:"".concat(e.key,": ").concat(e.value)},n)}))})]})},_=function(e){var n=e.conditions;return(0,C.jsx)(W,{title:"Conditions",columns:["type","status"],columnsLabels:["Type","Status"],items:n})},q=function(e){var n=e.tolerations;return(0,C.jsx)(W,{title:"Tolerations",columns:["effect","key","operator","tolerationSeconds"],columnsLabels:["Effect","Key","Operator","Seconds of toleration"],items:n})},z=function(e){var n=e.volumes;return(0,C.jsx)(r.Fragment,{children:n.map((function(e,n){return(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(O,{title:"Volume ".concat(e.name)}),(0,C.jsxs)(N.Z,{sx:(0,s.Z)({},D),children:[e.pvc&&(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(B.Z,{label:"Type",value:"Persistant Volume Claim"}),(0,C.jsx)(B.Z,{label:"Claim Name",value:e.pvc.claimName})]}),e.projected&&(0,C.jsx)(B.Z,{label:"Type",value:"Projected"})]})]},n)}))})},W=function(e){var n=e.title,t=e.items,a=e.columns,s=e.columnsLabels;return(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(O,{title:n}),(0,C.jsx)(N.Z,{children:(0,C.jsx)(A.Z,{component:p.Z,children:(0,C.jsxs)(w.Z,{"aria-label":"collapsible table",children:[(0,C.jsx)(I.Z,{children:(0,C.jsx)(R.Z,{children:s.map((function(e,n){return(0,C.jsx)(F.Z,{children:e},n)}))})}),(0,C.jsx)(E.Z,{children:t.map((function(e,n){return(0,C.jsx)(R.Z,{children:a.map((function(n,t){return(0,C.jsx)(F.Z,{children:e[n]},t)}))},n)}))})]})})})]})},G=function(e){var n=e.containers;return(0,C.jsx)(r.Fragment,{children:n.map((function(e,n){return(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(O,{title:"Container ".concat(e.name)}),(0,C.jsxs)(N.Z,{style:{wordBreak:"break-all"},sx:(0,s.Z)({},D),children:[(0,C.jsx)(B.Z,{label:"Image",value:e.image}),(0,C.jsx)(B.Z,{label:"Ready",value:"".concat(e.ready)}),(0,C.jsx)(B.Z,{label:"Ports",value:e.ports.join(", ")}),(0,C.jsx)(B.Z,{label:"Host Ports",value:e.hostPorts.join(", ")}),(0,C.jsx)(B.Z,{label:"Arguments",value:e.args.join(", ")}),(0,C.jsx)(B.Z,{label:"Started",value:e.state.started}),(0,C.jsx)(B.Z,{label:"State",value:e.state.state})]}),(0,C.jsxs)(N.Z,{style:{wordBreak:"break-all"},sx:(0,s.Z)({},D),children:[(0,C.jsx)(B.Z,{label:"Image ID",value:e.imageID}),(0,C.jsx)(B.Z,{label:"Container ID",value:e.containerID})]}),(0,C.jsx)(W,{title:"Mounts",columns:["name","mountPath"],columnsLabels:["Name","Mount Path"],items:e.mounts}),(0,C.jsx)(W,{title:"Environment Variables",columns:["key","value"],columnsLabels:["Key","Value"],items:e.environmentVariables})]},n)}))})},U=(0,c.Z)((function(e){return(0,l.Z)((0,s.Z)((0,s.Z)((0,s.Z)((0,s.Z)((0,s.Z)({},u.OR),u.Si),u.qg),u.bp),{},{actionsTray:(0,s.Z)((0,s.Z)({},u.OR.actionsTray),{},{padding:"15px 0 0"})}))}))((function(e){e.classes;var n=e.tenant,t=e.namespace,s=e.podName,i=e.propLoading,o=(0,b.TL)(),l=(0,Z.v9)((function(e){return e.tenants.loadingTenant})),c=(0,r.useState)(),u=(0,a.Z)(c,2),j=u[0],h=u[1],p=(0,r.useState)(!0),f=(0,a.Z)(p,2),v=f[0],S=f[1],k=(0,r.useState)(0),T=(0,a.Z)(k,2),L=T[0],N=T[1];(0,r.useEffect)((function(){i&&S(!0)}),[i]),(0,r.useEffect)((function(){l&&S(!0)}),[l]),(0,r.useEffect)((function(){v&&g.Z.invoke("GET","/api/v1/namespaces/".concat(t,"/tenants/").concat(n,"/pods/").concat(s,"/describe")).then((function(e){h(e),S(!1)})).catch((function(e){o((0,y.Ih)(e)),S(!1)}))}),[v,s,t,n,o]);return(0,C.jsx)(r.Fragment,{children:j&&(0,C.jsxs)(d.ZP,{item:!0,xs:12,children:[(0,C.jsxs)(x.Z,{value:L,onChange:function(e,n){N(n)},indicatorColor:"primary",textColor:"primary","aria-label":"cluster-tabs",variant:"scrollable",scrollButtons:"auto",children:[(0,C.jsx)(m.Z,{id:"pod-describe-summary",label:"Summary"}),(0,C.jsx)(m.Z,{id:"pod-describe-annotations",label:"Annotations"}),(0,C.jsx)(m.Z,{id:"pod-describe-labels",label:" Labels"}),(0,C.jsx)(m.Z,{id:"pod-describe-conditions",label:"Conditions"}),(0,C.jsx)(m.Z,{id:"pod-describe-tolerations",label:"Tolerations"}),(0,C.jsx)(m.Z,{id:"pod-describe-volumes",label:"Volumes"}),(0,C.jsx)(m.Z,{id:"pod-describe-containers",label:"Containers"})]}),function(e,n){switch(e){case 0:return(0,C.jsx)(H,{describeInfo:n});case 1:return(0,C.jsx)(V,{annotations:n.annotations});case 2:return(0,C.jsx)(M,{labels:n.labels});case 3:return(0,C.jsx)(_,{conditions:n.conditions});case 4:return(0,C.jsx)(q,{tolerations:n.tolerations});case 5:return(0,C.jsx)(z,{volumes:n.volumes});case 6:return(0,C.jsx)(G,{containers:n.containers})}}(L,j)]})})})),K=(0,c.Z)((function(e){return(0,l.Z)((0,s.Z)({breadcrumLink:{textDecoration:"none",color:"black"}},(0,u.Bz)(e.spacing(4))))}))((function(e){var n=e.classes,t=(0,o.UO)(),l=t.tenantNamespace,c=t.tenantName,u=t.podName,Z=(0,r.useState)(0),j=(0,a.Z)(Z,2),h=j[0],p=j[1],f=(0,r.useState)(!0),g=(0,a.Z)(f,2),v=g[0],b=g[1];function y(e){return{id:"simple-tab-".concat(e),"aria-controls":"simple-tabpanel-".concat(e)}}return(0,r.useEffect)((function(){v&&b(!1)}),[v]),(0,C.jsxs)(r.Fragment,{children:[(0,C.jsx)(d.ZP,{item:!0,xs:12,children:(0,C.jsxs)("h1",{className:n.sectionTitle,children:[(0,C.jsx)(i.rU,{to:"/namespaces/".concat(l||"","/tenants/").concat(c||"","/pods"),className:n.breadcrumLink,children:"Pods"})," ","> ",u]})}),(0,C.jsxs)(d.ZP,{container:!0,children:[(0,C.jsx)(d.ZP,{item:!0,xs:9,children:(0,C.jsxs)(x.Z,{value:h,onChange:function(e,n){p(n)},indicatorColor:"primary",textColor:"primary","aria-label":"cluster-tabs",variant:"scrollable",scrollButtons:"auto",children:[(0,C.jsx)(m.Z,(0,s.Z)({label:"Events"},y(0))),(0,C.jsx)(m.Z,(0,s.Z)({label:"Describe"},y(1))),(0,C.jsx)(m.Z,(0,s.Z)({label:"Logs"},y(2)))]})}),0===h&&(0,C.jsx)(L,{tenant:c||"",namespace:l||"",podName:u||"",propLoading:v}),1===h&&(0,C.jsx)(U,{tenant:c||"",namespace:l||"",podName:u||"",propLoading:v}),2===h&&(0,C.jsx)(S,{tenant:c||"",namespace:l||"",podName:u||"",propLoading:v})]})]})}))}}]);
//# sourceMappingURL=4873.4e512648.chunk.js.map