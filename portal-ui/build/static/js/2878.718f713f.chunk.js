(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[2878],{55521:function(e,t,n){"use strict";n.r(t);var o=n(29439),a=n(1413),i=n(72791),r=n(26181),c=n.n(r),s=n(60364),l=n(11135),d=n(25787),u=n(61889),p=n(27391),v=n(63466),m=n(23814),h=n(81207),Z=n(92983),f=n(74900),b=n(75578),x=n(81551),j=n(87995),g=n(16871),P=n(80184),k=(0,b.Z)(i.lazy((function(){return n.e(2112).then(n.bind(n,32112))})));t.default=(0,d.Z)((function(e){return(0,l.Z)((0,a.Z)((0,a.Z)((0,a.Z)({},m.oZ),m.VX),(0,m.Bz)(e.spacing(4))))}))((function(e){var t=e.classes,n=(0,x.TL)(),r=(0,g.s0)(),l=(0,g.UO)(),d=l.tenantName,m=l.tenantNamespace,b=(0,s.v9)((function(e){return e.tenants.loadingTenant})),y=(0,i.useState)([]),z=(0,o.Z)(y,2),S=z[0],C=z[1],w=(0,i.useState)(""),E=(0,o.Z)(w,2),V=E[0],I=E[1],L=(0,i.useState)(!0),M=(0,o.Z)(L,2),N=M[0],H=M[1],A=(0,i.useState)(null),R=(0,o.Z)(A,2),F=R[0],T=R[1],B=(0,i.useState)(!1),O=(0,o.Z)(B,2),D=O[0],K=O[1];(0,i.useEffect)((function(){N&&h.Z.invoke("GET","/api/v1/namespaces/".concat(m,"/tenants/").concat(d,"/pvcs")).then((function(e){var t=c()(e,"pvcs",[]);C(t||[]),H(!1)})).catch((function(e){H(!1),n((0,j.Ih)(e))}))}),[N,n,d,m]);var U=S.filter((function(e){return e.name.toLowerCase().includes(V.toLowerCase())}));return(0,i.useEffect)((function(){b&&H(!0)}),[b]),(0,P.jsxs)(i.Fragment,{children:[D&&(0,P.jsx)(k,{deleteOpen:D,selectedPVC:F,closeDeleteModalAndRefresh:function(e){K(!1),H(!0)}}),(0,P.jsxs)(u.ZP,{container:!0,spacing:1,children:[(0,P.jsx)("h1",{className:t.sectionTitle,children:"Volumes"}),(0,P.jsx)(u.ZP,{item:!0,xs:12,children:(0,P.jsx)(p.Z,{placeholder:"Search Volumes (PVCs)",className:t.searchField,id:"search-resource",label:"",InputProps:{disableUnderline:!0,startAdornment:(0,P.jsx)(v.Z,{position:"start",children:(0,P.jsx)(f.Z,{})})},onChange:function(e){I(e.target.value)},variant:"standard"})}),(0,P.jsx)(u.ZP,{item:!0,xs:12,className:t.tableBlock,children:(0,P.jsx)(Z.Z,{itemActions:[{type:"view",onClick:function(e){r("/namespaces/".concat(m||"","/tenants/").concat(d||"","/pvcs/").concat(e.name))}},{type:"delete",onClick:function(e){var t=(0,a.Z)((0,a.Z)({},e),{},{tenant:d,namespace:m});T(t),K(!0)}}],columns:[{label:"Name",elementKey:"name"},{label:"Status",elementKey:"status",width:120},{label:"Capacity",elementKey:"capacity",width:120},{label:"Storage Class",elementKey:"storageClass"}],isLoading:N,records:U,entityName:"PVCs",idField:"name",customPaperHeight:t.tableWrapper})})]})]})}))},26759:function(e,t,n){"use strict";var o=n(95318);t.Z=void 0;var a=o(n(45649)),i=n(80184),r=(0,a.default)((0,i.jsx)("path",{d:"m7 10 5 5 5-5z"}),"ArrowDropDown");t.Z=r},70366:function(e,t,n){"use strict";var o=n(95318);t.Z=void 0;var a=o(n(45649)),i=n(80184),r=(0,a.default)((0,i.jsx)("path",{d:"m7 14 5-5 5 5z"}),"ArrowDropUp");t.Z=r},97911:function(e,t,n){"use strict";var o=n(95318);t.Z=void 0;var a=o(n(45649)),i=n(80184),r=(0,a.default)((0,i.jsx)("path",{d:"M14.67 5v14H9.33V5h5.34zm1 14H21V5h-5.33v14zm-7.34 0V5H3v14h5.33z"}),"ViewColumn");t.Z=r},94454:function(e,t,n){"use strict";n.d(t,{Z:function(){return S}});var o=n(4942),a=n(63366),i=n(87462),r=n(72791),c=n(94419),s=n(12065),l=n(97278),d=n(76189),u=n(80184),p=(0,d.Z)((0,u.jsx)("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"}),"CheckBoxOutlineBlank"),v=(0,d.Z)((0,u.jsx)("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"}),"CheckBox"),m=(0,d.Z)((0,u.jsx)("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"}),"IndeterminateCheckBox"),h=n(14036),Z=n(31402),f=n(66934),b=n(21217);function x(e){return(0,b.Z)("MuiCheckbox",e)}var j=(0,n(75878).Z)("MuiCheckbox",["root","checked","disabled","indeterminate","colorPrimary","colorSecondary"]),g=["checkedIcon","color","icon","indeterminate","indeterminateIcon","inputProps","size"],P=(0,f.ZP)(l.Z,{shouldForwardProp:function(e){return(0,f.FO)(e)||"classes"===e},name:"MuiCheckbox",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.indeterminate&&t.indeterminate,"default"!==n.color&&t["color".concat((0,h.Z)(n.color))]]}})((function(e){var t,n=e.theme,a=e.ownerState;return(0,i.Z)({color:n.palette.text.secondary},!a.disableRipple&&{"&:hover":{backgroundColor:(0,s.Fq)("default"===a.color?n.palette.action.active:n.palette[a.color].main,n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"default"!==a.color&&(t={},(0,o.Z)(t,"&.".concat(j.checked,", &.").concat(j.indeterminate),{color:n.palette[a.color].main}),(0,o.Z)(t,"&.".concat(j.disabled),{color:n.palette.action.disabled}),t))})),k=(0,u.jsx)(v,{}),y=(0,u.jsx)(p,{}),z=(0,u.jsx)(m,{}),S=r.forwardRef((function(e,t){var n,o,s=(0,Z.Z)({props:e,name:"MuiCheckbox"}),l=s.checkedIcon,d=void 0===l?k:l,p=s.color,v=void 0===p?"primary":p,m=s.icon,f=void 0===m?y:m,b=s.indeterminate,j=void 0!==b&&b,S=s.indeterminateIcon,C=void 0===S?z:S,w=s.inputProps,E=s.size,V=void 0===E?"medium":E,I=(0,a.Z)(s,g),L=j?C:f,M=j?C:d,N=(0,i.Z)({},s,{color:v,indeterminate:j,size:V}),H=function(e){var t=e.classes,n=e.indeterminate,o=e.color,a={root:["root",n&&"indeterminate","color".concat((0,h.Z)(o))]},r=(0,c.Z)(a,x,t);return(0,i.Z)({},t,r)}(N);return(0,u.jsx)(P,(0,i.Z)({type:"checkbox",inputProps:(0,i.Z)({"data-indeterminate":j},w),icon:r.cloneElement(L,{fontSize:null!=(n=L.props.fontSize)?n:V}),checkedIcon:r.cloneElement(M,{fontSize:null!=(o=M.props.fontSize)?o:V}),ownerState:N,ref:t},I,{classes:H}))}))},63466:function(e,t,n){"use strict";n.d(t,{Z:function(){return P}});var o=n(4942),a=n(63366),i=n(87462),r=n(72791),c=n(28182),s=n(94419),l=n(14036),d=n(20890),u=n(93840),p=n(52930),v=n(66934),m=n(21217);function h(e){return(0,m.Z)("MuiInputAdornment",e)}var Z,f=(0,n(75878).Z)("MuiInputAdornment",["root","filled","standard","outlined","positionStart","positionEnd","disablePointerEvents","hiddenLabel","sizeSmall"]),b=n(31402),x=n(80184),j=["children","className","component","disablePointerEvents","disableTypography","position","variant"],g=(0,v.ZP)("div",{name:"MuiInputAdornment",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,t["position".concat((0,l.Z)(n.position))],!0===n.disablePointerEvents&&t.disablePointerEvents,t[n.variant]]}})((function(e){var t=e.theme,n=e.ownerState;return(0,i.Z)({display:"flex",height:"0.01em",maxHeight:"2em",alignItems:"center",whiteSpace:"nowrap",color:(t.vars||t).palette.action.active},"filled"===n.variant&&(0,o.Z)({},"&.".concat(f.positionStart,"&:not(.").concat(f.hiddenLabel,")"),{marginTop:16}),"start"===n.position&&{marginRight:8},"end"===n.position&&{marginLeft:8},!0===n.disablePointerEvents&&{pointerEvents:"none"})})),P=r.forwardRef((function(e,t){var n=(0,b.Z)({props:e,name:"MuiInputAdornment"}),o=n.children,v=n.className,m=n.component,f=void 0===m?"div":m,P=n.disablePointerEvents,k=void 0!==P&&P,y=n.disableTypography,z=void 0!==y&&y,S=n.position,C=n.variant,w=(0,a.Z)(n,j),E=(0,p.Z)()||{},V=C;C&&E.variant,E&&!V&&(V=E.variant);var I=(0,i.Z)({},n,{hiddenLabel:E.hiddenLabel,size:E.size,disablePointerEvents:k,position:S,variant:V}),L=function(e){var t=e.classes,n=e.disablePointerEvents,o=e.hiddenLabel,a=e.position,i=e.size,r=e.variant,c={root:["root",n&&"disablePointerEvents",a&&"position".concat((0,l.Z)(a)),r,o&&"hiddenLabel",i&&"size".concat((0,l.Z)(i))]};return(0,s.Z)(c,h,t)}(I);return(0,x.jsx)(u.Z.Provider,{value:null,children:(0,x.jsx)(g,(0,i.Z)({as:f,ownerState:I,className:(0,c.Z)(L.root,v),ref:t},w,{children:"string"!==typeof o||z?(0,x.jsxs)(r.Fragment,{children:["start"===S?Z||(Z=(0,x.jsx)("span",{className:"notranslate",children:"\u200b"})):null,o]}):(0,x.jsx)(d.Z,{color:"text.secondary",children:o})}))})}))},26769:function(e,t,n){var o=n(39066),a=n(93629),i=n(43141);e.exports=function(e){return"string"==typeof e||!a(e)&&i(e)&&"[object String]"==o(e)}}}]);
//# sourceMappingURL=2878.718f713f.chunk.js.map